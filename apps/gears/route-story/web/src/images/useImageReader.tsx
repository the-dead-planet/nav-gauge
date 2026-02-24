import { Dispatch, SetStateAction } from "react";
import maplibregl from "maplibre-gl";
import { Cartomancer } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { WebMarkerImage, parseImage } from "./image-parser";
import { RouteStoryGear } from "@the-dead-planet/nav-gauge-gears-route-story-common";

type ImageReaderResult = (file: File, geojson?: GeoJson) => void;

export const useImageReader = (
    onImagesChange: Dispatch<SetStateAction<WebMarkerImage[]>>
): ImageReaderResult => {
    const readImage = (file: File, geojson?: GeoJson) => {
        const reader = new FileReader();

        reader.onloadstart = () => {
            onImagesChange((prev) => RouteStoryGear.pushInitialImage(prev, file.name));
        };

        reader.onprogress = (e) => {
            onImagesChange((prev) => RouteStoryGear.updateImageProgress(prev, file.name, e.loaded / e.total * 100))
        };

        reader.onload = async (e) => {
            const { data, bitmap, lngLat, error } = await parseImage(file, e);
            onImagesChange((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                const [featureId, feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

                nextImages[index] = {
                    ...nextImages[index],
                    progress: 100,
                    lngLat,
                    data,
                    bitmap,
                    error,
                    featureId,
                };

                if (feature) {
                    const markerElement = document.createElement('div');
                    const featureLngLat = new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

                    nextImages[index].markerElement = markerElement;
                    nextImages[index].marker = new maplibregl.Marker({
                        element: markerElement,
                        draggable: true,
                    }).setLngLat(featureLngLat);
                }

                return nextImages;
            });
        };

        reader.onerror = (e) => {
            onImagesChange((prev) => RouteStoryGear.updateImageError(prev, file.name, e.target?.error?.message));
        };

        reader.readAsDataURL(file);
    };

    return readImage;
};
