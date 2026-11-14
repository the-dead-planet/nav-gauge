import { RefObject, useEffect, useRef } from "react";
import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import { GeoJson } from "@tinker-chest";
import {
    draggingImage$,
    draggingPlacement$,
    getRoutePlacement,
    MAP_IMAGE_MARKER_OFFSET_Y,
    MAP_IMAGE_COUNT_BADGE_OFFSET,
    THUMBNAIL_IMAGE_SIZE,
    RouteGeometryData,
    updateImageDistanceFraction,
    selectMapImageMarker,
    clearImageMarkerSelection,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "./image-parser";
import { MapImageHitTarget } from "./model";

interface MarkerGesture {
    imageId: number;
    groupCount: number;
    groupSize: number;
    x: number;
    y: number;
    moved: boolean;
}

export const useMapImageInteraction = (
    map: MobileMap,
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>,
    geojson: GeoJson | undefined,
    routeGeometryData: RouteGeometryData | null,
    markerLayerVisibility: boolean,
    hitTargets: RefObject<MapImageHitTarget[]>,
) => {
    const gestureRef = useRef<MarkerGesture | null>(null);
    const pendingHits = useRef<MapImageHitTarget[]>([]);

    useEffect(() => {
        const id = "route-story-thumbnails-layer";
        const shouldStartHandlers = new Map(map.onPanResponderShouldStartHandlers$.value);
        shouldStartHandlers.set(id, (event) => {
            if (!map.map$.value || !markerLayerVisibility || event.nativeEvent.touches.length > 1) {
                return false;
            }
            const { locationX, locationY } = event.nativeEvent;
            const thumbnail = hitTargets.current.findLast(
                ({ feature, point: [x, y] }) =>
                    !feature.properties.markerAnchor &&
                    (Math.hypot(locationX - x, locationY - y - MAP_IMAGE_MARKER_OFFSET_Y) <=
                        THUMBNAIL_IMAGE_SIZE / 2 + 12 ||
                        ((feature.properties.markerCount ?? 1) > 1 &&
                            Math.hypot(
                                locationX - x - MAP_IMAGE_COUNT_BADGE_OFFSET[0],
                                locationY - y - MAP_IMAGE_COUNT_BADGE_OFFSET[1],
                            ) <= 12)),
            );
            const target =
                thumbnail ??
                hitTargets.current.findLast(
                    ({ feature, point: [x, y] }) =>
                        feature.properties.markerAnchor && Math.hypot(locationX - x, locationY - y) <= 12,
                ) ??
                null;
            if (target) {
                pendingHits.current.push(target);
            }
            return target !== null;
        });
        map.onPanResponderShouldStartHandlers$.next(shouldStartHandlers);
        const startHandlers = new Map(map.onPanResponderStartHandlers$.value);
        startHandlers.set(id, async (event) => {
            const target = pendingHits.current.shift();
            if (!target || !map.map$.value || !markerLayerVisibility) {
                return;
            }
            const properties = target.feature.properties;
            const gesture: MarkerGesture = {
                imageId: properties.imageId,
                groupCount: properties.markerCount ?? 1,
                groupSize: properties.markerGroupSize ?? 1,
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
                moved: false,
            };
            gestureRef.current = gesture;
            const { locationX, locationY } = event.nativeEvent;
            map.dragPan$.next(false);
            if (gesture.groupCount === 1) {
                const image = images$.value.find(({ id }) => id === gesture.imageId);
                if (!geojson || !routeGeometryData || image?.distanceFraction === undefined) {
                    return;
                }
                const [routeX, routeY] = target.routePoint;
                map.panResponderOffset = [routeX - locationX, routeY - locationY];
                draggingImage$.next({
                    id: gesture.imageId,
                    interaction: "map",
                });
                const handlers = new Map(map.onPanResponderMoveHandlers$.value);
                handlers.set(id, moveHandler);
                map.onPanResponderMoveHandlers$.next(handlers);
            }
        });
        map.onPanResponderStartHandlers$.next(startHandlers);

        const moveHandler = async (coordinate: number[], event: GestureResponderEvent) => {
            const gesture = gestureRef.current;
            if (!gesture) {
                return;
            }
            const x = event.nativeEvent.pageX;
            const y = event.nativeEvent.pageY;
            gesture.moved ||= Math.hypot(x - gesture.x, y - gesture.y) >= 4;
            if (!geojson || !gesture.moved || gesture.groupCount > 1) {
                return;
            }
            const placement = getRoutePlacement({ lng: coordinate[0], lat: coordinate[1] }, geojson, routeGeometryData);
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
            if (gesture.moved && gesture.groupCount === 1) {
                clearImageMarkerSelection();
            }
            if (cancelled) {
                return;
            }
            if (!gesture.moved) {
                selectMapImageMarker(gesture.imageId, gesture.groupSize);
            } else if (geojson && gesture.groupCount === 1) {
                const placement = getRoutePlacement(
                    { lng: coordinate[0], lat: coordinate[1] },
                    geojson,
                    routeGeometryData,
                );
                if (placement) {
                    updateImageDistanceFraction(images$, gesture.imageId, placement.distanceFraction);
                }
            }
        });
        map.onPanResponderEndHandlers$.next(endHandlers);
        const pressHandlers = new Map(map.onPressHandlers$.value);
        pressHandlers.set(id, async () => clearImageMarkerSelection());
        map.onPressHandlers$.next(pressHandlers);

        return () => {
            const ownedGesture = gestureRef.current !== null || pendingHits.current.length > 0;
            gestureRef.current = null;
            pendingHits.current = [];
            map.panResponderOffset = [0, 0];
            if (draggingImage$.value?.interaction === "map") {
                draggingImage$.next(null);
                draggingPlacement$.next(null);
            }
            if (ownedGesture) {
                map.dragPan$.next(true);
            }
            const removeHandler = <T,>(handlers$: BehaviorSubject<Map<string, T>>) => {
                const handlers = new Map(handlers$.value);
                handlers.delete(id);
                handlers$.next(handlers);
            };
            removeHandler(map.onPanResponderStartHandlers$);
            removeHandler(map.onPanResponderShouldStartHandlers$);
            removeHandler(map.onPanResponderMoveHandlers$);
            removeHandler(map.onPanResponderEndHandlers$);
            removeHandler(map.onPressHandlers$);
        };
    }, [map, images$, geojson, routeGeometryData, markerLayerVisibility, hitTargets]);
};
