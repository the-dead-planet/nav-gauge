import * as maplibregl from "maplibre-gl";
import { routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    map: maplibregl.Map,
    line: GeoJSON.GeoJSON,
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
): void => {
    map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.line)?.setData(line);
    map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.currentPoint)?.setData(currentPoint);
};
