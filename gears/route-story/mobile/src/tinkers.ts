import distance from "@turf/distance";
import { Cartomancer } from "@apparatus";
import { LoadedMobileImageData } from "./images/useLoadedMobileImages";
import { getRouteLngLatAtDistanceFraction, RouteGeometryData, THUMBNAIL_IMAGE_SIZE } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FeatureProperties, GeoJson } from "@tinker-chest";

/**
 * Finds thumbnails in at given (touch) coordinate considering a buffer in pixels.
 */
export const findThumbnailsWithinBuffer = (
    [lng, lat]: number[],
    zoom: number,
    images: LoadedMobileImageData[],
    geojson: GeoJson | undefined,
    routeGeometryData: RouteGeometryData | null,
    { devicePixelRatio }: { devicePixelRatio: number; }
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties & { imageId: number; }>[] => {
    if (!geojson || !routeGeometryData) {
        return [];
    }
    const buffer = Cartomancer.getBufferInMeters(lat, zoom, THUMBNAIL_IMAGE_SIZE / 2 / devicePixelRatio);

    return images
        .map((image) => {
            const lngLat = getRouteLngLatAtDistanceFraction(geojson, routeGeometryData, image.distanceFraction);

            return {
                type: 'Feature' as const,
                geometry: {
                    type: 'Point' as const,
                    coordinates: [lngLat.lng, lngLat.lat],
                },
                properties: {
                    id: image.id,
                    time: '',
                    imageId: image.id,
                },
            };
        })
        .filter((f) => distance([lng, lat], f.geometry.coordinates, { units: 'meters' }) <= buffer);
};
