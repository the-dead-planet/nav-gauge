import { FC, useEffect, useMemo } from "react";
import {
    useStateWarden,
    useSubjectState,
    LoadedImageData,
} from "@apparatus";
import { useMapSourceAndLayers, MapLayerData, UpdatedData, MapSourceAndLayers } from "@web-ui";
import { emptyCollection, GeoJson } from "@tinker-chest";
import {
    ImageFeatureProperties,
    getIconImageId,
    IMAGE_PROPERTY,
    IMAGE_ANIMATION_DURATION,
    IMAGE_THUMBNAIL_PROPERTY,
    imageSourceIds,
    imageLayerIds,
    layerOrder,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { WebMarkerImageData } from "./image-parser";
import { displayImageLayers } from "./images-layers";

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
    geojson?: GeoJson;
    loadedImages: LoadedImageData<WebMarkerImageData>[];
    playerOperator: PlayerOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const ImageInDisplayLayer: FC<Props> = ({
    map,
    geojson,
    loadedImages,
    playerOperator,
}) => {
    const { animatrix } = useStateWarden();
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;

    const mapLayerData = useMemo((): MapLayerData => ({
        sourceId: imageSourceIds.imageInDisplay,
        source: {
            type: 'geojson',
            data: !geojson ? emptyCollection : getData(geojson, loadedImages, displayImageId)
        },
        layers: displayImageLayers,
    }), [])

    const updatedData = useMemo(
        (): UpdatedData => ({
            sourceId: imageSourceIds.imageInDisplay,
            data: !geojson ? emptyCollection : getData(geojson, loadedImages, displayImageId),
            delayMs: displayImageId === null ? IMAGE_ANIMATION_DURATION : undefined
        }),
        [geojson, loadedImages, displayImageId]
    );

    useEffect(() => {
        const updateIconSize = (value: number) => {
            if (map.getLayer(imageLayerIds.imageInDisplay)) {
                map.setLayoutProperty(imageLayerIds.imageInDisplay, 'icon-size', value);
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

    return (
        <MapSourceAndLayers map={map} mapLayerData={mapLayerData} updatedData={updatedData} layerOrder={layerOrder} />
    );
};
