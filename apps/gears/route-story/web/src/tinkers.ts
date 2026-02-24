import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { CurrentPointData, MarkerImage } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { getRouteSourceData, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { LoadedImageData } from "./images/image-parser";
import { sourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    controls: { showRouteLine: boolean; showRoutePoints: boolean },
    map: maplibregl.Map,
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
    bearingLineLengthInMeters: number,
    nextImageFeatureId?: number,
): CurrentPointData => {
    const { currentPoint, lines, ...rest } = getRouteSourceData(controls, geojson, startTimeEpoch, progressMs, bearingLineLengthInMeters, nextImageFeatureId);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);

    return { currentPoint, lines, ...rest };
};

export const getIconImageId = (image: LoadedImageData): string => `image-${image.id}`;

export const updateImageFeatureId = (
    images$: BehaviorSubject<MarkerImage[]>,
    imageId: number,
    featureId: number
) => {
    images$.next(images$.value.map((im) => im.id === imageId ? { ...im, featureId } : im))
};
