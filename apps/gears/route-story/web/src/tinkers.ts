import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { MarkerImage } from "@apparatus";
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

export function updateImageFeatureId<TImageData>(
    images$: BehaviorSubject<MarkerImage<TImageData>[]>,
    imageId: number,
    featureId: number
) {
    images$.next(images$.value.map((im) => im.id === imageId ? { ...im, featureId } : im))
}
