import { useEffect, useRef } from "react";
import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import { GeoJson } from "@tinker-chest";
import {
    draggingImage$,
    expandedImageGroupId$,
    draggingPlacement$,
    getRoutePlacement,
    getRouteLngLatAtDistanceFraction,
    imageLayerIds,
    RouteGeometryData,
    selectedImageId$,
    updateImageDistanceFraction,
    selectMapImageMarker,
    clearImageMarkerSelection,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "./image-parser";

interface MarkerGesture {
    imageId: number | null;
    groupCount: number;
    groupSize: number;
    x: number;
    y: number;
    moved: boolean;
    ready: Promise<void>;
}

export const useMapImageInteraction = (
    map: MobileMap,
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>,
    geojson: GeoJson | undefined,
    routeGeometryData: RouteGeometryData | null,
    markerLayerVisibility: boolean,
) => {
    const gestureRef = useRef<MarkerGesture | null>(null);

    useEffect(() => {
        const id = "route-story-thumbnails-layer";
        const startHandlers = new Map(map.onPanResponderStartHandlers$.value);
        startHandlers.set(id, async (event) => {
            const mapRef = map.map$.value;
            if (!mapRef || !markerLayerVisibility) {
                return;
            }
            const gesture: MarkerGesture = {
                imageId: null,
                groupCount: 0,
                groupSize: 0,
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
                moved: false,
                ready: Promise.resolve(),
            };
            gestureRef.current = gesture;
            const { locationX, locationY } = event.nativeEvent;
            gesture.ready = mapRef
                .queryRenderedFeatures(
                    [
                        [locationX - 12, locationY - 12],
                        [locationX + 12, locationY + 12],
                    ],
                    {
                        layers: [
                            imageLayerIds.anchors,
                            imageLayerIds.thumbnails,
                            imageLayerIds.countBadge,
                        ],
                    },
                )
                .then(async (features) => {
                    const properties = features[0]?.properties;
                    if (gestureRef.current !== gesture || !properties) {
                        return;
                    }
                    gesture.imageId = Number(properties.imageId);
                    gesture.groupCount = Number(properties.markerCount ?? 1);
                    gesture.groupSize = Number(properties.markerGroupSize ?? 1);
                    if (gesture.groupCount === 1) {
                        const image = images$.value.find(({ id }) => id === gesture.imageId);
                        if (!geojson || !routeGeometryData || image?.distanceFraction === undefined) {
                            return;
                        }
                        const point = getRouteLngLatAtDistanceFraction(geojson, routeGeometryData, image.distanceFraction);
                        const [routeX, routeY] = await mapRef.project([point.lng, point.lat]);
                        if (gestureRef.current !== gesture) {
                            return;
                        }
                        map.panResponderOffset = [routeX - locationX, routeY - locationY];
                        map.dragPan$.next(false);
                        draggingImage$.next({
                            id: gesture.imageId,
                            interaction: "map",
                        });
                        const handlers = new Map(map.onPanResponderMoveHandlers$.value);
                        handlers.set(id, moveHandler);
                        map.onPanResponderMoveHandlers$.next(handlers);
                    }
                })
                .catch(() => {
                    // The map may detach while a native feature query is pending.
                });
            await gesture.ready;
        });
        map.onPanResponderStartHandlers$.next(startHandlers);

        const moveHandler = async (coordinate: number[], event: GestureResponderEvent) => {
            const gesture = gestureRef.current;
            if (!gesture) {
                return;
            }
            const x = event.nativeEvent.pageX;
            const y = event.nativeEvent.pageY;
            await gesture.ready;
            if (gestureRef.current !== gesture) {
                return;
            }
            gesture.moved ||= Math.hypot(x - gesture.x, y - gesture.y) >= 4;
            if (
                !geojson ||
                !gesture.moved ||
                gesture.imageId === null ||
                gesture.groupCount > 1
            ) {
                return;
            }
            const placement = getRoutePlacement(
                { lng: coordinate[0], lat: coordinate[1] },
                geojson,
                routeGeometryData,
            );
            if (placement) {
                draggingPlacement$.next(placement);
            }
        };

        const endHandlers = new Map(map.onPanResponderEndHandlers$.value);
        endHandlers.set(id, async (coordinate, event, cancelled) => {
            const gesture = gestureRef.current;
            if (!gesture) {
                return;
            }
            const x = event.nativeEvent.pageX;
            const y = event.nativeEvent.pageY;
            await gesture.ready;
            if (gestureRef.current !== gesture) {
                return;
            }
            gestureRef.current = null;
            const handlers = new Map(map.onPanResponderMoveHandlers$.value);
            handlers.delete(id);
            map.onPanResponderMoveHandlers$.next(handlers);
            gesture.moved ||= Math.hypot(x - gesture.x, y - gesture.y) >= 4;
            map.dragPan$.next(true);
            if (draggingImage$.value?.interaction === "map") {
                draggingImage$.next(null);
            }
            draggingPlacement$.next(null);
            if (gesture.moved && gesture.imageId !== null && gesture.groupCount === 1) {
                clearImageMarkerSelection();
            }
            if (cancelled) {
                return;
            }
            if (!gesture.moved) {
                if (gesture.imageId === null) {
                    selectedImageId$.next(null);
                    expandedImageGroupId$.next(null);
                } else {
                    selectMapImageMarker(gesture.imageId, gesture.groupSize);
                }
            } else if (
                geojson &&
                gesture.imageId !== null &&
                gesture.groupCount === 1
            ) {
                const placement = getRoutePlacement(
                    { lng: coordinate[0], lat: coordinate[1] },
                    geojson,
                    routeGeometryData,
                );
                if (placement) {
                    updateImageDistanceFraction(
                        images$,
                        gesture.imageId,
                        placement.distanceFraction,
                    );
                }
            }
        });
        map.onPanResponderEndHandlers$.next(endHandlers);

        return () => {
            gestureRef.current = null;
            map.panResponderOffset = [0, 0];
            if (draggingImage$.value?.interaction === "map") {
                draggingImage$.next(null);
                draggingPlacement$.next(null);
                map.dragPan$.next(true);
            }
            const removeHandler = <T,>(handlers$: BehaviorSubject<Map<string, T>>) => {
                const handlers = new Map(handlers$.value);
                handlers.delete(id);
                handlers$.next(handlers);
            };
            removeHandler(map.onPanResponderStartHandlers$);
            removeHandler(map.onPanResponderMoveHandlers$);
            removeHandler(map.onPanResponderEndHandlers$);
        };
    }, [map, images$, geojson, routeGeometryData, markerLayerVisibility]);
};
