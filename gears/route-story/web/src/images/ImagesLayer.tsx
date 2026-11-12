import { FC, useEffect, useMemo, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps, FeatureStateProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { useTheme } from "@ui";
import { useLoadedWebImages } from "../hooks/useLoadedWebImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { MapImageData, useRouteLayerImages } from "../hooks";
import {
    getIconImageId,
    getImageSource,
    getRoutePlacement,
    imageSourceIds,
    layerOrder,
    draggingImage$,
    draggingPlacement$,
    updateImageDistanceFraction,
    highlightIdsBySourceId$,
    selectedImageId$,
    expandedImageGroupId$,
    imageLayerIds,
    getImageMarkerConnections,
    ImagesLayers,
    DRAGGED_IMAGE_ID,
    selectMapImageMarker,
    IMAGE_COUNT_BADGE_ID,
    IMAGE_BADGE_SDF_URI,
    getImageSourceWithMarkerVisibility,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useImageMarkerSource } from "./useImageMarkerSource";
import { getImagesLayers } from "./images-layers";
import { ImageDragPreview } from "./ImageDragPreview";
import { WebRouteStoryProps } from "../model";

export const ImagesLayer: FC<
    OverlayComponentProps<maplibregl.Map> & WebRouteStoryProps
> = ({
    map,
    animatrix,
    data$,
    state$,
    routeGeometryData$,
    images$,
    playerOperator,
}) => {
    const theme = useTheme();
    const imageHighlightColor = theme.color("tertiary", 500);
    const badgeTextColor = theme.resolveAppearance("fill", "tertiary").glyphs;
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [images] = useSubjectState(images$);
    const [{ markerLayerVisibility }] = useSubjectState(state$);
    const loadedImages = useLoadedWebImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(
        highlightIdsBySourceId$,
    );
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const dragStartPoint = useRef<{ x: number; y: number } | null>(null);
    const didDrag = useRef(false);

    const mapImages = useMemo(
        (): MapImageData[] => [
            {
                iconImageName: IMAGE_COUNT_BADGE_ID,
                data: { data: IMAGE_BADGE_SDF_URI, width: 64, height: 64 },
                metadata: { sdf: true, pixelRatio: 2 },
            },
            ...loadedImages.flatMap((image): MapImageData[] => [
                {
                    iconImageName: getIconImageId(image),
                    data: image.data.bitmap!,
                },
                {
                    iconImageName: getIconImageId(image, { thumbnail: true }),
                    data: image.data.thumbnailBitmap!,
                },
            ]),
        ],
        [loadedImages],
    );
    useRouteLayerImages(map, mapImages);

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson, routeGeometryData),
        [loadedImages, geojson, routeGeometryData],
    );
    const groupedSource = useImageMarkerSource(
        map,
        sourceDataGeojson,
        displayImageId !== null,
    );
    const visibleSource = useMemo(() => getImageSourceWithMarkerVisibility(groupedSource, markerLayerVisibility), [groupedSource, markerLayerVisibility]);
    const connectionsLayerData = useMemo(
        (): MapLayerData => ({
            sourceId: imageSourceIds.connections,
            source: {
                type: "geojson",
                data: getImageMarkerConnections(
                    sourceDataGeojson,
                    visibleSource,
                ),
            },
            layers: [
                {
                    id: imageLayerIds.connections,
                    type: "line",
                    source: imageSourceIds.connections,
                    paint: ImagesLayers.connections.paint,
                },
            ],
        }),
        [sourceDataGeojson, visibleSource],
    );

    const mapLayerData = useMemo(
        (): MapLayerData => ({
            sourceId: imageSourceIds.thumbnails,
            source: {
                type: "geojson",
                data: sourceDataGeojson,
                promoteId: "imageId",
            },
            layers: getImagesLayers(
                displayImageId,
                imageHighlightColor,
                badgeTextColor,
            ),
            handlers: {
                options: {
                    buffer: 12,
                    isHoverEnabled: () =>
                        state$.value.markerLayerVisibility && draggingImage$.value?.interaction !== "map", // prevent lag when dragging
                },
                onMouseDown: ({ features, isTopRelated }, event) => {
                    const feature = features.find(
                        ({ properties }) =>
                            properties.imageId !== DRAGGED_IMAGE_ID,
                    );
                    didDrag.current = false;
                    map.getCanvas().style.cursor = "grabbing";
                    if (!state$.value.markerLayerVisibility || !isTopRelated || !feature) {
                        return;
                    }
                    dragStartPoint.current = event.point;
                    if (feature.properties.markerCount > 1) {
                        return;
                    }
                    map.dragPan.disable();
                    setDraggingImage({
                        id: feature.properties.imageId,
                        interaction: "map",
                    });
                },
                onMouseMove: ({ features, isTopRelated }) => {
                    if (
                        !isTopRelated ||
                        (draggingImage$.value !== null &&
                            draggingImage$.value.interaction === "map")
                    ) {
                        if (draggingImage$.value === null) {
                            map.getCanvas().style.cursor = "grab";
                        }
                        if (highlightIdsBySourceId$.value.size > 0) {
                            setHighlightIdsBySourceId(new Map());
                        }

                        return;
                    }

                    map.getCanvas().style.cursor = "pointer";
                    const ids = new Set(
                        features
                            .filter(
                                ({ properties }) =>
                                    properties.imageId !== DRAGGED_IMAGE_ID,
                            )
                            .map((feature) => feature.id?.toString() ?? ""),
                    );
                    setHighlightIdsBySourceId(
                        new Map([[imageSourceIds.thumbnails, ids]]),
                    );
                },
                onMouseUp: () => {
                    map.getCanvas().style.cursor = "grab";
                    if (draggingImage$.value?.interaction === "map") {
                        setDraggingImage(null);
                    }
                    map.dragPan.enable();
                },
                onClick: ({ features, isTopRelated }) => {
                    const feature = features.find(
                        ({ properties }) =>
                            properties.imageId !== DRAGGED_IMAGE_ID,
                    );
                    if (didDrag.current) {
                        return;
                    }
                    if (!isTopRelated || !feature) {
                        selectedImageId$.next(null);
                        expandedImageGroupId$.next(null);
                        return;
                    }
                    const imageId = Number(feature.properties.imageId);
                    selectMapImageMarker(
                        imageId,
                        Number(feature.properties.markerGroupSize ?? 1),
                    );
                },
            },
        }),
        [sourceDataGeojson, imageHighlightColor, badgeTextColor],
    );

    useEffect(() => {
        if (draggingImage === null) {
            return;
        }
        const update = (value: boolean) => {
            if (map.getSource(imageSourceIds.thumbnails)) {
                map.setFeatureState(
                    { source: imageSourceIds.thumbnails, id: draggingImage.id },
                    { [FeatureStateProps.Dragging]: value },
                );
            }
        };
        update(true);

        return () => {
            update(false);
        };
    }, [draggingImage]);

    useEffect(() => {
        if (draggingImage === null || draggingImage.interaction !== "map") {
            return;
        }

        const handleDrag = (event: {
            lngLat: maplibregl.LngLat;
            point?: { x: number; y: number };
            preventDefault?: () => void;
        }) => {
            if (!geojson) {
                return;
            }
            if (event.point && dragStartPoint.current) {
                if (
                    Math.hypot(
                        event.point.x - dragStartPoint.current.x,
                        event.point.y - dragStartPoint.current.y,
                    ) < 4 &&
                    !didDrag.current
                ) {
                    return;
                }
                didDrag.current = true;
            }
            event.preventDefault?.();
            draggingPlacement$.next(
                getRoutePlacement(event.lngLat, geojson, routeGeometryData),
            );
        };

        const handleDragEnd = (
            event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent,
        ) => {
            if (!geojson || !didDrag.current) {
                draggingPlacement$.next(null);
                return;
            }
            event.preventDefault();
            const placement = getRoutePlacement(
                event.lngLat,
                geojson,
                routeGeometryData,
            );
            const image = loadedImages.find(
                (image) => image.id === draggingImage.id,
            );
            draggingPlacement$.next(null);
            if (!image || !placement) {
                return;
            }
            updateImageDistanceFraction(
                images$,
                image.id,
                placement.distanceFraction,
            );
        };

        map.dragPan.disable();

        map.on("mousemove", handleDrag);
        map.on("mouseup", handleDragEnd);
        map.on("touchmove", handleDrag);
        map.on("touchend", handleDragEnd);

        return () => {
            draggingPlacement$.next(null);
            map.dragPan.enable();
            map.off("mousemove", handleDrag);
            map.off("mouseup", handleDragEnd);
            map.off("touchmove", handleDrag);
            map.off("touchend", handleDragEnd);
        };
    }, [draggingImage, loadedImages, geojson, routeGeometryData]);

    const updatedData = useMemo(() => {
        return {
            sourceId: imageSourceIds.thumbnails,
            data: visibleSource,
        };
    }, [visibleSource]);

    useImageInDisplay(map, animatrix, playerOperator);

    return (
        <>
            <MapSourceAndLayers
                map={map}
                mapLayerData={connectionsLayerData}
                layerOrder={layerOrder}
            />
            <MapSourceAndLayers
                map={map}
                mapLayerData={mapLayerData}
                highlightIdsBySourceId={highlightIdsBySourceId}
                layerOrder={layerOrder}
                updatedData={updatedData}
            />
            <ImageDragPreview map={map} source={groupedSource} visible={markerLayerVisibility} />
        </>
    );
};
