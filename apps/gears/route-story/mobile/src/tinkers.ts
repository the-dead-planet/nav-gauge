import distance from "@turf/distance";
import { Cartomancer } from "@apparatus";
import { LoadedMobileImageData } from "./images/useLoadedMobileImages";
import { THUMBNAIL_IMAGE_SIZE } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FeatureProperties, GeoJson } from "@tinker-chest";

/**
 * Finds
 * @param coordinate 
 * @param zoom 
 * @param geojson 
 * @param images 
 * @returns 
 */
export const findThumbnailsWithinBuffer = (
    [lng, lat]: [number, number],
    zoom: number,
    geojson: GeoJson,
    images: LoadedMobileImageData[]
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties>[] => {
    const buffer = Cartomancer.getBufferInMeters(lat, zoom, Math.round(THUMBNAIL_IMAGE_SIZE / 2));
    const imageFeatures = images
        .reduce<GeoJSON.Feature<GeoJSON.Point, FeatureProperties>[]>((acc, image) => {
            const f = geojson?.features.find((f) => f.properties.id === image.featureId);
            return f ? acc.concat([f]) : acc;
        }, [])
        .filter((f) => distance([lng, lat], f.geometry.coordinates, { units: 'meters' }) <= buffer);

    return imageFeatures;
};
