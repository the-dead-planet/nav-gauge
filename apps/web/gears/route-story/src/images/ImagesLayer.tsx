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
import { useLoadedImages } from "../hooks/useLoadedImages";
import {
    sourceIds,
    getImagesLayers,
    ImageFeature,
    ImageFeatureProperties,
    layerIds,
} from '../layers';
import { DisplayImageLayer } from "./DisplayImageLayer";
import { getIconImageId, updateImageFeatureId } from "../tinkers";
import { IMAGE_SIZE } from "./image-parser";
import { useMapImages } from "../hooks";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";

export const ImagesLayer: FC<OverlayComponentProps & RouteToolProps> = ({ map, data$, images$ }) => {
    const { theme } = useTheme();
    const [{ geojson }] = useSubjectState(data$);
    const [images] = useSubjectState(images$);
    const loadedImages = useLoadedImages(images);
    const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
    const [draggingId, setDraggingId] = useState<number | null>(null);

    useMapImages(map, loadedImages.filter((image) => !!image.bitmap).map((image) => ({
        icon: image.bitmap,
        iconImageId: getIconImageId(image),
        options: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE
        }
    })))

    const sourceDataGeojson = useMemo((): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> => ({
        type: 'FeatureCollection',
        features: loadedImages.reduce<ImageFeature[]>((acc, image) => {
            const feature = geojson?.features.find((f) => f.properties.id === image.featureId);
            if (feature) {
                acc.push({
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: image.id,
                        iconImageId: getIconImageId(image)
                    }
                });
            }
            return acc;
        }, [])
    }), [loadedImages, geojson]);

    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sources: {
                [sourceIds.image]: {
                    type: "geojson",
                    data: sourceDataGeojson,
                    promoteId: 'imageId'
                }
            },
            layers: getImagesLayers(theme),
            beforeLayerId: layerIds.imageInDisplay,
            handlers: {
                onMouseMove: ({ features, isTopRelated }) => {
                    if (!isTopRelated) {
                        return;
                    }
                    setHighlightIds(new Set(features.map((f) => f.id?.toString() ?? '')));
                },
                onMouseDown: ({ features, isTopRelated }) => {
                    if (!isTopRelated || features.length === 0) {
                        return;
                    }
                    setDraggingId(features[0].properties.imageId);
                },
                onMouseUp: () => setDraggingId(null)
            },
        };
    }, [theme, sourceDataGeojson]);

    useMapLayerData(map, mapLayerData, [[sourceIds.image, highlightIds]]);

    useEffect(() => {
        if (draggingId === null) {
            return
        }
        const update = (value: boolean) => {
            if (map.getSource(sourceIds.image)) {
                map.setFeatureState({ source: sourceIds.image, id: draggingId }, { [FeatureStateProps.Dragging]: value });
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
        map.dragPan.disable();
        const handleDrag = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            if (!geojson) {
                return;
            }
            event.preventDefault();
            const [_id, feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingId);
            const source = map.getSource(sourceIds.image) as maplibregl.GeoJSONSource | undefined;

            if (!source || !image) {
                return;
            }

            source.setData({
                ...sourceDataGeojson,
                features: sourceDataGeojson.features.concat([{
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: -1,
                        iconImageId: getIconImageId(image)
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

        map.on('mousemove', handleDrag);
        map.on('mouseup', handleDragEnd);
        map.on('touchmove', handleDrag);
        map.on('touchend', handleDragEnd);

        return () => {
            map.off('mousemove', handleDrag);
            map.off('mouseup', handleDragEnd);
            map.off('touchmove', handleDrag);
            map.off('touchend', handleDragEnd);
            map.dragPan.enable();
        };
    }, [draggingId]);

    if (!geojson) {
        return null;
    }

    return <DisplayImageLayer map={map} geojson={geojson} loadedImages={loadedImages} />;
};
