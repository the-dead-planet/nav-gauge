import { FeatureStateProps, LoadedImageData } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { getIconImageId, getRouteLngLatAtDistanceFraction, RouteGeometryData } from "../tinkers";

export const IMAGE_ANIMATION_DURATION = 250;
export const IMAGE_PROPERTY = 'iconImageId';
export const IMAGE_THUMBNAIL_PROPERTY = 'iconImageThumbnailId';
export const DRAGGED_IMAGE_ID = -1;

export type ImageFeature = GeoJSON.Feature<GeoJSON.Point, ImageFeatureProperties>;
export interface ImageFeatureProperties {
    imageId: number;
    [IMAGE_PROPERTY]: string;
    [IMAGE_THUMBNAIL_PROPERTY]: string;
    [FeatureStateProps.Highlight]?: boolean;
    [FeatureStateProps.Dragging]?: boolean;
}

export function getImageSource<TImageData>(
    loadedImages: LoadedImageData<TImageData>[],
    geojson?: GeoJson,
    routeGeometryData?: RouteGeometryData | null,
): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> {
    if (!geojson || !routeGeometryData) {
        return {
            type: 'FeatureCollection',
            features: [],
        };
    }

    return {
        type: 'FeatureCollection',
        features: loadedImages.map((image) => {
            const lngLat = getRouteLngLatAtDistanceFraction(geojson, routeGeometryData, image.distanceFraction);

            return {
                type: 'Feature',
                id: image.id,
                geometry: {
                    type: 'Point',
                    coordinates: [lngLat.lng, lngLat.lat],
                },
                properties: {
                    imageId: image.id,
                    [IMAGE_PROPERTY]: getIconImageId(image),
                    [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                }
            };
        })
    };
}
