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
    getDraggingImageSource,
    getImageMarkerConnections,
    ImagesLayers,
    DRAGGED_IMAGE_ID,
    toggleImageMarkerGroup,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useImageMarkerSource } from "./useImageMarkerSource";
import { ImageMarkerCount } from "./ImageMarkerCount";
import { getImagesLayers } from "./images-layers";
import { WebRouteStoryProps } from "../model";

export const ImagesLayer: FC<
    OverlayComponentProps<maplibregl.Map> & WebRouteStoryProps
> = ({
    map,
    animatrix,
    data$,
    routeGeometryData$,
    images$,
    playerOperator,
}) => {
    const theme = useTheme();
    const imageHighlightColor = theme.color("tertiary", 500);
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedWebImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(
        highlightIdsBySourceId$,
    );
    const [draggingPlacement, setDraggingPlacement] =
        useSubjectState(draggingPlacement$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [showImageMarkers] = useSubjectState(
        playerOperator.showImageMarkers$,
    );
    const dragStartPoint = useRef<{ x: number; y: number } | null>(null);
    const didDrag = useRef(false);

    useRouteLayerImages(
        map,
        loadedImages
            .filter((image) => !!image.data.bitmap)
            .map((image): MapImageData => ({
                fullSize: {
                    iconImageName: getIconImageId(image),
                    data: image.data.bitmap!,
                },
                thumbnail: {
                    iconImageName: getIconImageId(image, { thumbnail: true }),
                    data: image.data.thumbnailBitmap!,
                },
            })),
    );

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson, routeGeometryData),
        [loadedImages, geojson, routeGeometryData],
    );
    const groupedSource = useImageMarkerSource(
        map,
        sourceDataGeojson,
        displayImageId !== null,
    );
    const connectionsLayerData = useMemo(
        (): MapLayerData => ({
            sourceId: imageSourceIds.connections,
            source: {
                type: "geojson",
                data: getImageMarkerConnections(
                    sourceDataGeojson,
                    groupedSource,
                ),
            },
            layers: [
                {
                    id: imageLayerIds.connections,
                    type: "line",
                    source: imageSourceIds.connections,
                    paint: ImagesLayers.connections.paint,
                    layout: {
                        visibility: showImageMarkers ? "visible" : "none",
                    },
                },
            ],
        }),
        [sourceDataGeojson, groupedSource, showImageMarkers],
    );

    const mapLayerData = useMemo(
        (): MapLayerData => ({
            sourceId: imageSourceIds.thumbnails,
            source: {
                type: "geojson",
                data: sourceDataGeojson,
                promoteId: "imageId",
            },
            layers: getImagesLayers(displayImageId, imageHighlightColor), // displayImageId is not a dependency, filter will be updated in effect of useImageInDisplay
            handlers: {
                options: { buffer: 12 },
                onMouseDown: ({ features, isTopRelated }, event) => {
                    const feature = features.find(
                        ({ properties }) =>
                            properties.imageId !== DRAGGED_IMAGE_ID,
                    );
                    didDrag.current = false;
                    map.getCanvas().style.cursor = "grabbing";
                    if (
                        !playerOperator.showImageMarkers$.value ||
                        !isTopRelated ||
                        !feature
                    ) {
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
                    if (!playerOperator.showImageMarkers$.value) {
                        return;
                    }
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
                    if (
                        !playerOperator.showImageMarkers$.value ||
                        didDrag.current
                    ) {
                        return;
                    }
                    if (!isTopRelated || !feature) {
                        selectedImageId$.next(null);
                        expandedImageGroupId$.next(null);
                        return;
                    }
                    const imageId = Number(feature.properties.imageId);
                    toggleImageMarkerGroup([imageId]);
                },
            },
        }),
        [sourceDataGeojson, imageHighlightColor],
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
            setDraggingPlacement(
                getRoutePlacement(event.lngLat, geojson, routeGeometryData),
            );
        };

        const handleDragEnd = (
            event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent,
        ) => {
            if (!geojson || !didDrag.current) {
                setDraggingPlacement(null);
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
            setDraggingPlacement(null);
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
            setDraggingPlacement(null);
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
            data: getDraggingImageSource(
                groupedSource,
                draggingImage?.id ?? null,
                draggingPlacement,
            ),
        };
    }, [groupedSource, draggingPlacement, draggingImage]);

    useEffect(() => {
        for (const layerId of Object.values(imageLayerIds)) {
            if (
                layerId !== imageLayerIds.imageInDisplay &&
                map.getLayer(layerId)
            ) {
                map.setLayoutProperty(
                    layerId,
                    "visibility",
                    showImageMarkers ? "visible" : "none",
                );
            }
        }
    }, [map, showImageMarkers, mapLayerData]);

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
            {showImageMarkers &&
                groupedSource.features
                    .filter(
                        ({ properties }) =>
                            properties.markerVisible &&
                            (properties.markerCount ?? 1) > 1,
                    )
                    .map((feature) => (
                        <ImageMarkerCount
                            key={feature.id}
                            map={map}
                            feature={feature}
                        />
                    ))}
        </>
    );
};
