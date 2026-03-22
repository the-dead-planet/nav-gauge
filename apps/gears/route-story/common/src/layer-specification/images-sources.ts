import { LoadedImageData } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { getIconImageId } from "../tinkers";

export const IMAGE_ANIMATION_DURATION = 250;
export const IMAGE_PROPERTY = 'iconImageId';
export const IMAGE_THUMBNAIL_PROPERTY = 'iconImageThumbnailId';
export const DRAGGED_IMAGE_ID = -1;

export type ImageFeature = GeoJSON.Feature<GeoJSON.Point, ImageFeatureProperties>;
export interface ImageFeatureProperties {
    imageId: number;
    [IMAGE_PROPERTY]: string;
    [IMAGE_THUMBNAIL_PROPERTY]: string;
}

export function getImageSource<TImageData>(
    loadedImages: LoadedImageData<TImageData>[],
    geojson?: GeoJson,
): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> {
    return {
        type: 'FeatureCollection',
        features: loadedImages.reduce<ImageFeature[]>((acc, image) => {
            const feature = geojson?.features.find((f) => f.properties.id === image.featureId);
            if (feature) {
                acc.push({
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: image.id,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                });
            }
            return acc;
        }, [])
    };
}
