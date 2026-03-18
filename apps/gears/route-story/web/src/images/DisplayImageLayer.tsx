import { FC, useEffect, useMemo } from "react";
import {
    useStateWarden,
    useMapLayerData,
    useSubjectState,
    MapLayerData,
    LoadedImageData,
} from "@apparatus";
import { emptyCollection, GeoJson } from "@tinker-chest";
import {
    layerIds,
    sourceIds,
    getDisplayImageLayers,
    ImageFeatureProperties,
    getIconImageId,
    IMAGE_PROPERTY,
    ANIMATION_DURATION,
    IMAGE_IN_DISPLAY_SIZE,
    IMAGE_THUMBNAIL_PROPERTY,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { WebMarkerImageData } from "./image-parser";

function getData<TImageData>(
    geojson: GeoJson,
    loadedImages: LoadedImageData<TImageData>[],
    displayImageId: number | null
): GeoJSON.GeoJSON {
    const image = loadedImages.find((image) => image.id === displayImageId);
    if (!image) {
        return emptyCollection;
    }

    const geometry = geojson.features.find((f) => f.properties.id === image.featureId)?.geometry;
    if (!geometry) {
        return emptyCollection;
    }

    const properties: ImageFeatureProperties = {
        imageId: image.id,
        [IMAGE_PROPERTY]: getIconImageId(image),
        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
    };

    return {
        type: 'Feature',
        geometry,
        properties
    };
}

interface Props {
    map: maplibregl.Map,
    geojson: GeoJson;
    loadedImages: LoadedImageData<WebMarkerImageData>[];
    playerOperator: PlayerOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const DisplayImageLayer: FC<Props> = ({
    map,
    geojson,
    loadedImages,
    playerOperator,
}) => {
    const { animatrix } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;

    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sources: {
                [sourceIds.imageInDisplay]: {
                    type: 'geojson',
                    data: getData(geojson, loadedImages, displayImageId)
                }
            },
            layers: getDisplayImageLayers()
        };
    }, [])

    const updateData = useMemo(
        (): [string, GeoJSON.GeoJSON, number | undefined] => [
            sourceIds.imageInDisplay,
            getData(geojson, loadedImages, displayImageId),
            displayImageId === null ? ANIMATION_DURATION : undefined
        ],
        [geojson, loadedImages, displayImageId]
    );

    useMapLayerData(map, mapLayerData, [], updateData);

    useEffect(() => {
        const updateIconSize = (value: number) => {
            if (map.getLayer(layerIds.imageInDisplay)) {
                map.setLayoutProperty(layerIds.imageInDisplay, 'icon-size', value);
            }
        }

        if (isInDisplay) {
            const canvas = map.getCanvas();
            playerOperator.animateDisplayImage({
                width: canvas.width,
                height: canvas.height,
                devicePixelRatio: window.devicePixelRatio
            }, updateIconSize)
        }

        return () => {
            playerOperator.cleanupAnimateDisplayImage(updateIconSize);
        };
    }, [isInDisplay]);

    return null;
};
