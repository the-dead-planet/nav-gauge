import { Dispatch, SetStateAction } from "react";
import maplibregl from "maplibre-gl";
import { Cartomancer } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { MarkerImage, parseImage } from "./image-parser";

type ImageReaderResult = (file: File, geojson?: GeoJson) => void;

export const useImageReader = (
    onImagesChange: Dispatch<SetStateAction<MarkerImage[]>>
): ImageReaderResult => {
    const readImage = (file: File, geojson?: GeoJson) => {
        const reader = new FileReader();

        const getNext = (ids: number[]) => {
            let i = 0;
            while (ids.includes(i)) {
                i++;
            }
            return i;
        };

        reader.onloadstart = () => {
            onImagesChange((prev) => prev.filter((el) => el.name !== file.name).concat({
                id: getNext(prev.map((el) => el.id)),
                name: file.name,
                progress: 0
            }));
        };

        reader.onprogress = (e) => {
            onImagesChange((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], progress: Number((e.loaded / e.total * 100).toFixed(0)) };

                return nextImages;
            });
        };

        reader.onload = async (e) => {
            const { data, bitmap, exif, lngLat, error } = await parseImage(file, e);
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
                    exif,
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
            onImagesChange((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], error: e.target?.error?.message ?? 'Cannot read file' };

                return nextImages;
            });
        };

        reader.readAsDataURL(file);
    };

    return readImage;
};
