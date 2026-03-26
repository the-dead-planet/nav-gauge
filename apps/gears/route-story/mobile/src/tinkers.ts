import distance from "@turf/distance";
import { Cartomancer } from "@apparatus";
import { LoadedMobileImageData } from "./images/useLoadedMobileImages";
import { IMAGE_MARKER_SIZE } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FeatureProperties, GeoJson } from "@tinker-chest";

export const getImageFeature = (
    c: [number, number],
    zoom: number,
    geojson: GeoJson,
    images: LoadedMobileImageData[]
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties>[] => {
    const buffer = Cartomancer.getBufferInMeters(c[1], zoom, Math.round(IMAGE_MARKER_SIZE / 2));
    const imageFeatures = images
        .reduce<GeoJSON.Feature<GeoJSON.Point, FeatureProperties>[]>((acc, image) => {
            const f = geojson?.features.find((f) => f.properties.id === image.featureId);
            return f ? acc.concat([f]) : acc;
        }, [])
        .filter((f) => distance(c, f.geometry.coordinates, { units: 'meters' }) <= buffer);

    return imageFeatures;
};
