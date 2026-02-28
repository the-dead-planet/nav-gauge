import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { MarkerImage } from "@apparatus";
import { sourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    map: maplibregl.Map,
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
    lines: GeoJSON.GeoJSON,
): void => {
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
};

export const updateImageFeatureId = (
    images$: BehaviorSubject<MarkerImage[]>,
    imageId: number,
    featureId: number
) => {
    images$.next(images$.value.map((im) => im.id === imageId ? { ...im, featureId } : im))
};
