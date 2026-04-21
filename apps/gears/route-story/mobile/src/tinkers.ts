import distance from "@turf/distance";
import { Cartomancer } from "@apparatus";
import { LoadedMobileImageData } from "./images/useLoadedMobileImages";
import { THUMBNAIL_IMAGE_SIZE } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FeatureProperties, GeoJson } from "@tinker-chest";

/**
 * Finds thumbnails in at given (touch) coordinate considering a buffer in pixels.
 */
export const findThumbnailsWithinBuffer = (
    [lng, lat]: number[],
    zoom: number,
    images: LoadedMobileImageData[],
    geojson: GeoJson | undefined,
    { devicePixelRatio }: { devicePixelRatio: number; }
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties & { imageId: number; }>[] => {
    if (!geojson) {
        return [];
    }
    const buffer = Cartomancer.getBufferInMeters(lat, zoom, THUMBNAIL_IMAGE_SIZE / 2 / devicePixelRatio);

    return images
        .reduce<GeoJSON.Feature<GeoJSON.Point, FeatureProperties & { imageId: number; }>[]>((acc, image) => {
            const f = geojson.features.find((f) => f.properties.id === image.featureId);
            return f ? acc.concat([{
                ...f,
                properties: {
                    ...f.properties,
                    imageId: image.id,
                }
            }]) : acc;
        }, [])
        .filter((f) => distance([lng, lat], f.geometry.coordinates, { units: 'meters' }) <= buffer);
};
