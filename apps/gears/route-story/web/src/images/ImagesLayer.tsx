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
import { DisplayImageLayer } from "./DisplayImageLayer";
import { updateImageFeatureId } from "../tinkers";
import { MapImageData, useRouteLayerImages } from "../hooks";
import {
    RouteToolProps,
    getIconImageId,
    getImageSource,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
    imageSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "./image-parser";
import { getImagesLayers } from "./layers";

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
    const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
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
    }, [themeName, sourceDataGeojson]);

    useMapLayerData(map, mapLayerData, [[imageSourceIds.thumbnails, highlightIds]]);

    useEffect(() => {
        if (draggingId === null) {
            return
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
        map.dragPan.disable();
        const handleDrag = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            if (!geojson) {
                return;
            }
            event.preventDefault();
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
                        imageId: -1,
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

    return (
        <DisplayImageLayer
            map={map}
            geojson={geojson}
            loadedImages={loadedImages}
            playerOperator={playerOperator}
        />
    );
};
