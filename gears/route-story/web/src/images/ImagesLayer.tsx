import { FC, useEffect, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps, FeatureStateProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { useLoadedWebImages } from "../hooks/useLoadedWebImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { MapImageData, useRouteLayerImages } from "../hooks";
import {
    getIconImageId,
    getImageSource,
    getRouteLngLatAtDistanceFraction,
    getRoutePlacement,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    imageSourceIds,
    DRAGGED_IMAGE_ID,
    layerOrder,
    draggingImage$,
    draggingPlacement$,
    updateImageDistanceFraction,
    highlightIdsBySourceId$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getImagesLayers } from "./images-layers";
import { WebRouteStoryProps } from "../model";

export const ImagesLayer: FC<OverlayComponentProps<maplibregl.Map> & WebRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    routeGeometryData$,
    images$,
    playerOperator,
}) => {
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedWebImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingPlacement, setDraggingPlacement] = useSubjectState(draggingPlacement$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);

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
                    data: image.data.thumbnailBitmap!
                }
            })));

    const sourceDataGeojson = useMemo(
        () => getImageSource(loadedImages, geojson, routeGeometryData),
        [loadedImages, geojson, routeGeometryData]
    );

    const mapLayerData = useMemo((): MapLayerData => ({
        sourceId: imageSourceIds.thumbnails,
        source: {
            type: "geojson",
            data: sourceDataGeojson,
            promoteId: 'imageId'
        },
        layers: getImagesLayers(displayImageId), // displayImageId is not a dependency, filter will be updated in effect of useImageInDisplay
        handlers: {
            onMouseDown: ({ features, isTopRelated }) => {
                map.getCanvas().style.cursor = 'grabbing';
                if (!isTopRelated || features.length === 0) {
                    return;
                }
                map.dragPan.disable();
                setDraggingImage({ id: features[0].properties.imageId, interaction: 'map' });
            },
            onMouseMove: ({ features, isTopRelated }) => {
                if (!isTopRelated || (draggingImage$.value !== null && draggingImage$.value.interaction === 'map')) {
                    if (draggingImage$.value === null) {
                        map.getCanvas().style.cursor = 'grab';
                    }
                    setHighlightIdsBySourceId(new Map());

                    return;
                }

                map.getCanvas().style.cursor = 'pointer';
                const ids = new Set(features.map((f) => f.id?.toString() ?? ''));
                setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, ids]]));
            },
            onMouseUp: () => {
                map.getCanvas().style.cursor = 'grab';
                setDraggingImage(null);
                map.dragPan.enable();
            }
        },
    }), [sourceDataGeojson]);

    useEffect(() => {
        if (draggingImage === null) {
            return;
        }
        const update = (value: boolean) => {
            if (map.getSource(imageSourceIds.thumbnails)) {
                map.setFeatureState({ source: imageSourceIds.thumbnails, id: draggingImage.id }, { [FeatureStateProps.Dragging]: value });
            }
        };
        update(true);

        return () => {
            update(false);
        };
    }, [draggingImage]);

    useEffect(() => {
        if (draggingImage === null || draggingImage.interaction !== 'map') {
            return;
        }

        const handleDrag = (event: {
            lngLat: maplibregl.LngLat;
            preventDefault?: () => void;
        }) => {
            if (!geojson) {
                return;
            }
            event.preventDefault?.();
            setDraggingPlacement(getRoutePlacement(event.lngLat, geojson, routeGeometryData));
        };

        const handleDragEnd = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            if (!geojson) {
                return;
            }
            event.preventDefault();
            const placement = getRoutePlacement(event.lngLat, geojson, routeGeometryData);
            const image = loadedImages.find((image) => image.id === draggingImage.id)
            setDraggingPlacement(null);
            if (!image || !placement) {
                return;
            }
            updateImageDistanceFraction(images$, image.id, placement.distanceFraction);
        };

        map.dragPan.disable();

        const image = loadedImages.find((image) => image.id === draggingImage.id);
        if (image && geojson && routeGeometryData) {
            const lngLat = getRouteLngLatAtDistanceFraction(geojson, routeGeometryData, image.distanceFraction);
            handleDrag({ lngLat: new maplibregl.LngLat(lngLat.lng, lngLat.lat) });
        }

        map.on('mousemove', handleDrag);
        map.on('mouseup', handleDragEnd);
        map.on('touchmove', handleDrag);
        map.on('touchend', handleDragEnd);

        return () => {
            setDraggingPlacement(null);
            map.dragPan.enable();
            map.off('mousemove', handleDrag);
            map.off('mouseup', handleDragEnd);
            map.off('touchmove', handleDrag);
            map.off('touchend', handleDragEnd);
        };
    }, [draggingImage, loadedImages, geojson, routeGeometryData]);

    useEffect(() => {
        if (!draggingImage) {
            return;
        }
        const image = loadedImages.find((image) => image.id === draggingImage.id);
        const source = map.getSource(imageSourceIds.thumbnails) as maplibregl.GeoJSONSource | undefined;

        if (!source || !image) {
            return;
        }

        source.setData(!draggingPlacement
            ? sourceDataGeojson
            : {
                ...sourceDataGeojson,
                features: sourceDataGeojson.features.concat([{
                    type: 'Feature',
                    id: -1,
                    geometry: {
                        type: 'Point',
                        coordinates: [draggingPlacement.lngLat.lng, draggingPlacement.lngLat.lat],
                    },
                    properties: {
                        imageId: DRAGGED_IMAGE_ID,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                }])
            });
    }, [draggingPlacement]);

    useImageInDisplay(map, animatrix, playerOperator);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            highlightIdsBySourceId={highlightIdsBySourceId}
            layerOrder={layerOrder}
        />
    );
};
