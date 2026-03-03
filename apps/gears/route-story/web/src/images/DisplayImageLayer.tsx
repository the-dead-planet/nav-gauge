import { FC, useEffect, useMemo } from "react";
import {
    useStateWarden,
    useMapLayerData,
    useSubjectState,
    MapLayerData,
} from "@apparatus";
import { emptyCollection, GeoJson } from "@tinker-chest";
import { LoadedImageData } from "./image-parser";
import {
    layerIds,
    sourceIds,
    getDisplayImageLayers,
    ImageFeatureProperties,
    getIconImageId,
    IMAGE_PROPERTY,
    ANIMATION_DURATION
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";

const getData = (
    geojson: GeoJson,
    loadedImages: LoadedImageData[],
    displayImageId: number | null
): GeoJSON.GeoJSON => {
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
        [IMAGE_PROPERTY]: getIconImageId(image)
    };

    return {
        type: 'Feature',
        geometry,
        properties
    };
};

interface Props {
    map: maplibregl.Map,
    geojson: GeoJson;
    loadedImages: LoadedImageData[];
    playerOperator: PlayerOperator<maplibregl.Map>;
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
            playerOperator.animateDisplayImage({ width: canvas.width, height: canvas.height }, updateIconSize)
        }

        return () => {
            playerOperator.cleanupAnimateDisplayImage(updateIconSize);
        };
    }, [isInDisplay]);

    return null;
};
