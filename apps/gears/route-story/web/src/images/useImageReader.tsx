import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { Cartomancer, useSubjectState } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { parseImage, WebMarkerImage } from "./image-parser";
import { FileOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common";

type ImageReaderResult = (file: File, geojson?: GeoJson) => void;

export const useImageReader = (
    fileOperator: FileOperator<maplibregl.Map>,
    images$: BehaviorSubject<WebMarkerImage[]>
): ImageReaderResult => {
    const [_images, setImages] = useSubjectState(images$);

    const readImage = (file: File, geojson?: GeoJson) => {
        const reader = new FileReader();

        reader.onloadstart = () => {
            fileOperator.pushInitialImage(file.name);
        };

        reader.onprogress = (e) => {
            fileOperator.updateImageProgress(file.name, e.loaded / e.total * 100)
        };

        reader.onload = async (e) => {
            const { data, bitmap, lngLat, error } = await parseImage(file, e);
            setImages((prev) => {
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
            fileOperator.updateImageError(file.name, e.target?.error?.message);
        };

        reader.readAsDataURL(file);
    };

    return readImage;
};
