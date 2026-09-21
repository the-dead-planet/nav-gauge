import { formatTimeMsAsStandard, GeoJson } from "@tinker-chest";
import { RouteTimes } from "../model";
import { RouteGeometryData } from "./source-layers";

/**
 * Current progress as percentage of total duration.
 * @returns Value between 0 and 100.
 */
export const getProgressPercentage = (progressMs: number, routeTimes?: RouteTimes | null): number => {
    if (!routeTimes) {
        return 0;
    }
    return (progressMs / routeTimes.duration * 100);
};

export const getRouteDistanceFraction = (
    progressMs: number,
    geojson?: GeoJson,
    routeTimes?: RouteTimes | null,
    routeGeometryData?: RouteGeometryData | null,
): number => {
    if (!geojson || !routeTimes || !routeGeometryData) {
        return 0;
    }
    const currentTime = routeTimes.startTimeEpoch + progressMs;
    const followingIndex = geojson.features.findIndex((feature) => new Date(feature.properties.time).valueOf() > currentTime);
    if (followingIndex < 0) {
        return 1;
    }
    if (followingIndex === 0) {
        return 0;
    }
    const previousIndex = followingIndex - 1;
    const previousTime = new Date(geojson.features[previousIndex].properties.time).valueOf();
    const followingTime = new Date(geojson.features[followingIndex].properties.time).valueOf();
    const fraction = (currentTime - previousTime) / (followingTime - previousTime);
    const previousDistance = routeGeometryData.lookup[previousIndex].lineProgress;
    const followingDistance = routeGeometryData.lookup[followingIndex].lineProgress;

    return previousDistance + (followingDistance - previousDistance) * fraction;
};

export const formatCurrentTimestamp = (progressMs: number, progressPercentage: number): string => {
    return `${formatTimeMsAsStandard(progressMs)} (${progressPercentage.toFixed(0)}%)`;
};
