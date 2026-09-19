import { RouteTimes } from "../model";

/**
 * Current route timeline position as percentage of total duration.
 * @returns Value between 0 and 100.
 */
export const getRouteTimelinePercentage = (routeTimelinePositionMs: number, routeTimes?: RouteTimes | null): number => {
    if (!routeTimes) {
        return 0;
    }
    return (routeTimelinePositionMs / routeTimes.duration * 100);
};
