import { FC, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { useTheme } from "@ui";
import {
    OverlayComponentProps,
    Cartomancer,
    FeatureStateProps,
    useMapLayerData,
    MapLayerData,
    useSubjectState
} from "@apparatus";
import { useLoadedWebImages } from "../hooks/useLoadedWebImages";
import { ImageInDisplayLayer } from "./ImageInDisplayLayer";
import { updateImageFeatureId } from "../tinkers";
import { MapImageData, useRouteLayerImages } from "../hooks";
import {
    RouteToolProps,
    getIconImageId,
    getImageSource,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    imageSourceIds,
    imageLayerIds,
    DRAGGED_IMAGE_ID,
    layerOrder,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "./image-parser";
import { getImagesLayers } from "./images-layers";

export const ImagesLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    data$,
    images$,
    playerOperator,
}) => {
    const { themeName } = useTheme();
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedWebImages(images);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useState<Map<string, Set<string>>>(new Map());
    const [draggingId, setDraggingId] = useState<number | null>(null);

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

    const mapLayerData = useMemo((): MapLayerData => {
        return {
            // beforeLayerId: imageLayerIds.imageInDisplay,
            sources: {
                [imageSourceIds.thumbnails]: {
                    type: "geojson",
                    data: sourceDataGeojson,
                    promoteId: 'imageId'
                }
            },
            layers: getImagesLayers(themeName),
            handlers: {
                onMouseMove: ({ features, isTopRelated }) => {
                    if (!isTopRelated || draggingId !== null) {
                        return;
                    }
                    const ids = new Set(features.map((f) => f.id?.toString() ?? ''));
                    setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, ids]]));
                },
                onMouseDown: ({ features, isTopRelated }) => {
                    if (!isTopRelated || features.length === 0) {
                        return;
                    }
                    map.dragPan.disable();
                    setDraggingId(features[0].properties.imageId);
                },
                onMouseUp: () => {
                    setDraggingId(null);
                    map.dragPan.enable();
                }
            },
        };
    }, [themeName, sourceDataGeojson, draggingId]);

    useMapLayerData(map, mapLayerData, { highlightIdsBySourceId, layerOrder });

    useEffect(() => {
        if (draggingId === null) {
            return;
        }
        const update = (value: boolean) => {
            if (map.getSource(imageSourceIds.thumbnails)) {
                map.setFeatureState({ source: imageSourceIds.thumbnails, id: draggingId }, { [FeatureStateProps.Dragging]: value });
            }
        };
        update(true);

        return () => {
            update(false);
        };
    }, [draggingId]);

    useEffect(() => {
        if (draggingId === null) {
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
            const [_id, feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingId);
            const source = map.getSource(imageSourceIds.thumbnails) as maplibregl.GeoJSONSource | undefined;

            if (!source || !image) {
                return;
            }

            source.setData({
                ...sourceDataGeojson,
                features: sourceDataGeojson.features.concat([{
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: DRAGGED_IMAGE_ID,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                }])
            });
        };

        const handleDragEnd = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            if (!geojson) {
                return;
            }
            event.preventDefault();
            const [id, _feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingId)
            if (!image) {
                return;
            }
            updateImageFeatureId(images$, image.id, id);

        };

        map.dragPan.disable();

        const imageFeatureId = loadedImages.find((image) => image.id === draggingId)?.featureId;
        const imageCoordinates = geojson?.features.find((feature) => feature.id === imageFeatureId)?.geometry.coordinates;
        if (imageCoordinates) {
            handleDrag({ lngLat: new maplibregl.LngLat(imageCoordinates[0], imageCoordinates[1]) });
        }

        map.on('mousemove', handleDrag);
        map.on('mouseup', handleDragEnd);
        map.on('touchmove', handleDrag);
        map.on('touchend', handleDragEnd);

        return () => {
            map.dragPan.enable();
            map.off('mousemove', handleDrag);
            map.off('mouseup', handleDragEnd);
            map.off('touchmove', handleDrag);
            map.off('touchend', handleDragEnd);
        };
    }, [draggingId, loadedImages, geojson]);

    return (
        <ImageInDisplayLayer
            map={map}
            geojson={geojson}
            loadedImages={loadedImages}
            playerOperator={playerOperator}
        />
    );
};
