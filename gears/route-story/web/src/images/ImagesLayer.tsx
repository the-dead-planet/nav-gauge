import { FC, useEffect, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps, Cartomancer, FeatureStateProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { useLoadedWebImages } from "../hooks/useLoadedWebImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { MapImageData, useRouteLayerImages } from "../hooks";
import {
    RouteStoryProps,
    getIconImageId,
    getImageSource,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    imageSourceIds,
    DRAGGED_IMAGE_ID,
    layerOrder,
    draggingImage$,
    draggingClosestFeature$,
    updateImageFeatureId,
    highlightIdsBySourceId$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "./image-parser";
import { getImagesLayers } from "./images-layers";

export const ImagesLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    animatrix,
    data$,
    images$,
    playerOperator,
}) => {
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedWebImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingClosestFeature, setDraggingClosestFeature] = useSubjectState(draggingClosestFeature$);
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
        () => getImageSource(loadedImages, geojson),
        [loadedImages, geojson]
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
            const [_closestId, closestFeature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            setDraggingClosestFeature(closestFeature);
        };

        const handleDragEnd = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            if (!geojson) {
                return;
            }
            event.preventDefault();
            const [id, _feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingImage.id)
            if (!image) {
                return;
            }
            setDraggingClosestFeature(null);
            updateImageFeatureId(images$, image.id, id);
        };

        map.dragPan.disable();

        const imageFeatureId = loadedImages.find((image) => image.id === draggingImage.id)?.featureId;
        const imageCoordinates = geojson?.features.find((feature) => feature.id === imageFeatureId)?.geometry.coordinates;
        if (imageCoordinates) {
            handleDrag({ lngLat: new maplibregl.LngLat(imageCoordinates[0], imageCoordinates[1]) });
        }

        map.on('mousemove', handleDrag);
        map.on('mouseup', handleDragEnd);
        map.on('touchmove', handleDrag);
        map.on('touchend', handleDragEnd);

        return () => {
            setDraggingClosestFeature(null);
            map.dragPan.enable();
            map.off('mousemove', handleDrag);
            map.off('mouseup', handleDragEnd);
            map.off('touchmove', handleDrag);
            map.off('touchend', handleDragEnd);
        };
    }, [draggingImage, loadedImages, geojson]);

    useEffect(() => {
        if (!draggingImage) {
            return;
        }
        const image = loadedImages.find((image) => image.id === draggingImage.id);
        const source = map.getSource(imageSourceIds.thumbnails) as maplibregl.GeoJSONSource | undefined;

        if (!source || !image) {
            return;
        }

        source.setData(!draggingClosestFeature
            ? sourceDataGeojson
            : {
                ...sourceDataGeojson,
                features: sourceDataGeojson.features.concat([{
                    type: 'Feature',
                    id: -1,
                    geometry: draggingClosestFeature.geometry,
                    properties: {
                        imageId: DRAGGED_IMAGE_ID,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                }])
            });
    }, [draggingClosestFeature]);

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
