
import turfAlong from "@turf/along";
import turfBearing from "@turf/bearing";
import turfDistance from "@turf/distance";
import { point as turfPoint, lineString as turfLine } from "@turf/helpers";
import { bezierSpline } from "@turf/bezier-spline";
import turfLength from "@turf/length";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { CurrentPointData, LoadedImageData } from "@apparatus";
import { clampZeroOne, emptyCollection, GeoJson, LngLat } from "@tinker-chest";
import { RouteStoryState } from "../model";
import { PlaybackPacing } from "../animatrix";
import { getNearestRouteSegment } from './nearest-route-segment';

export const getRouteSourceData = (
    { routeStyleActive, routeStyleInactive }: RouteStoryState,
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
    routeGeometryData: RouteGeometryData,
): CurrentPointData & { routeDistanceFraction: number } => {
    const currentTime = startTimeEpoch + progressMs;
    const followingIndex = geojson.features.findIndex((f) =>
        new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf()
    );
    const splitIndex = followingIndex < 0 ? geojson.features.length : followingIndex;
    const { currentPoint, fraction } = getCurrentPoint(geojson, splitIndex, currentTime);
    const heading = getSplineHeading(routeGeometryData, splitIndex, fraction);
    const routeDistanceFraction = getRouteDistanceFraction(routeGeometryData, splitIndex, fraction);
    currentPoint.properties = { ...currentPoint.properties, heading };

    const anyVisible =
        routeStyleActive.showRouteLine || routeStyleActive.showRoutePoints ||
        routeStyleInactive.showRouteLine || routeStyleInactive.showRoutePoints;

    return {
        splitIndex,
        fraction,
        heading,
        routeDistanceFraction,
        currentPoint,
        line: anyVisible
            ? {
                ...geojson,
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: geojson.features.slice(0, splitIndex).map((f) => f.geometry.coordinates).concat([currentPoint.geometry.coordinates])
                        },
                        properties: {
                            status: 'before',
                        }
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [currentPoint.geometry.coordinates].concat(geojson.features.slice(splitIndex).map((f) => f.geometry.coordinates))
                        },
                        properties: {
                            status: 'after',
                        }
                    },
                ].filter((feature) => feature.geometry.coordinates.length > 1) as GeoJSON.Feature<GeoJSON.LineString>[]
            }
            : emptyCollection,
    };
};

/**
 * @returns current point feature interpolated between the first features before/after it, plus the fractional position between them.
 */
const getCurrentPoint = (
    geojson: GeoJson,
    splitIndex: number,
    currentTime: number,
): {
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    fraction: number;
} => {
    const endIndex = Math.min(geojson.features.length - 1, Math.max(1, splitIndex));
    const currentLineStart = geojson.features[endIndex - 1];
    const currentLineEnd = geojson.features[endIndex];
    const currentLineStartTime = new Date(currentLineStart.properties.time).valueOf();
    const currentLineEndTime = new Date(currentLineEnd.properties.time).valueOf();

    const fraction = Math.max(0, Math.min(1, (currentTime - currentLineStartTime) / (currentLineEndTime - currentLineStartTime)));
    const currentLineStartPos = currentLineStart.geometry.coordinates;
    const currentLineEndPos = currentLineEnd.geometry.coordinates;
    const line = turfLine([currentLineStartPos, currentLineEndPos]);
    const totalDistanceMeters = turfLength(line, { units: 'meters' });
    const currentPoint = { ...currentLineEnd };
    currentPoint.geometry = turfAlong(line, totalDistanceMeters * fraction, { units: 'meters' }).geometry;

    return {
        currentPoint,
        fraction,
    };
};

export interface RouteGeometryData {
    spline: GeoJSON.Feature<GeoJSON.LineString>;
    lookup: Array<{ t: number; lineProgress: number }>;
    splinePoints: GeoJSON.Position[];
    totalDistanceMeters: number;
}

export const getRouteGeometryData = (geojson: GeoJson): RouteGeometryData => {
    const features = geojson.features;
    const spline = bezierSpline({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: features.map((f) => f.geometry.coordinates)
        },
        properties: {}
    }, { resolution: 500 });
    const splinePoints = spline.geometry.coordinates;
    const totalDistanceMeters = turfLength(turfLine(features.map((feature) => feature.geometry.coordinates)), { units: 'meters' });

    const lookup = buildSplineLookup(features, splinePoints);

    return { spline, lookup, splinePoints, totalDistanceMeters };
};

const buildSplineLookup = (
    features: GeoJson['features'],
    splinePoints: GeoJSON.Position[],
): Array<{ t: number; lineProgress: number }> => {
    const origCumulative = [0];
    for (let i = 1; i < features.length; i++) {
        origCumulative.push(
            origCumulative[i - 1] + turfDistance(
                features[i - 1].geometry.coordinates,
                features[i].geometry.coordinates,
                { units: 'meters' },
            )
        );
    }
    const origTotal = origCumulative[origCumulative.length - 1];

    const splineCumulative = [0];
    for (let i = 1; i < splinePoints.length; i++) {
        splineCumulative.push(
            splineCumulative[i - 1] + turfDistance(splinePoints[i - 1], splinePoints[i], { units: 'meters' })
        );
    }
    const splineTotal = splineCumulative[splineCumulative.length - 1];

    return features.map((_feature, i) => {
        const fraction = origTotal > 0 ? origCumulative[i] / origTotal : 0;
        const targetDistance = fraction * splineTotal;
        let bestIdx = 0;

        for (let j = 1; j < splineCumulative.length; j++) {
            if (splineCumulative[j] >= targetDistance) {
                bestIdx = j;
                break;
            }
            bestIdx = j;
        }

        return {
            t: bestIdx / (splinePoints.length - 1),
            lineProgress: fraction,
        };
    });
};

export const getRouteTimelinePositionForDistanceFraction = (
    geojson: GeoJson,
    routeGeometryData: RouteGeometryData,
    startTimeEpoch: number,
    routeDistanceFraction: number,
): number => {
    const clampedDistanceFraction = Math.max(0, Math.min(1, routeDistanceFraction));
    const endIndex = routeGeometryData.lookup.findIndex(({ lineProgress }) => lineProgress > clampedDistanceFraction);
    if (endIndex < 0) {
        return new Date(geojson.features.at(-1)!.properties.time).valueOf() - startTimeEpoch;
    }
    if (endIndex === 0) {
        return 0;
    }
    const startIndex = endIndex - 1;
    const startDistance = routeGeometryData.lookup[startIndex].lineProgress;
    const endDistance = routeGeometryData.lookup[endIndex].lineProgress;
    const fraction = (clampedDistanceFraction - startDistance) / (endDistance - startDistance);
    const startTime = new Date(geojson.features[startIndex].properties.time).valueOf();
    const endTime = new Date(geojson.features[endIndex].properties.time).valueOf();

    return startTime + (endTime - startTime) * fraction - startTimeEpoch;
};

const getRouteDistanceFraction = (routeGeometryData: RouteGeometryData, splitIndex: number, fraction: number): number => {
    const start = routeGeometryData.lookup[Math.max(0, splitIndex - 1)].lineProgress;
    const end = routeGeometryData.lookup[Math.min(routeGeometryData.lookup.length - 1, splitIndex)].lineProgress;

    return start + (end - start) * fraction;
};

export const getSplineHeading = (routeGeometryData: RouteGeometryData, splitIndex: number, fraction: number): number => {
    const { lookup, splinePoints } = routeGeometryData;
    const t1 = lookup[Math.max(0, splitIndex - 1)].t;
    const t2 = lookup[Math.min(lookup.length - 1, splitIndex)].t;
    const t = t1 + (t2 - t1) * fraction;
    const splineIdx = Math.min(splinePoints.length - 2, Math.max(1, Math.round(t * (splinePoints.length - 1))));

    return turfBearing(
        turfPoint(splinePoints[splineIdx - 1]),
        turfPoint(splinePoints[splineIdx + 1]),
    );
};

export function getIconImageId<TImageData>(
    imageData: LoadedImageData<TImageData>,
    { thumbnail }: { thumbnail?: boolean } = {}
): string {
    return `image-${imageData.id}${thumbnail ? '-thumbnail' : ''}`;
}

export const getRouteLngLatAtDistanceFraction = (
    geojson: GeoJson,
    routeGeometryData: RouteGeometryData,
    distanceFraction: number,
): LngLat => {
    const features = geojson.features;
    const lookup = routeGeometryData.lookup;
    const fraction = clampZeroOne(distanceFraction);
    const first = features[0].geometry.coordinates;
    if (features.length < 2 || lookup.length < 2) {
        return { lng: first[0], lat: first[1] };
    }

    const endIndex = lookup.findIndex(({ lineProgress }) => lineProgress >= fraction);
    if (endIndex === 0) {
        return { lng: first[0], lat: first[1] };
    }
    if (endIndex < 0) {
        const last = features[features.length - 1].geometry.coordinates;
        return { lng: last[0], lat: last[1] };
    }

    const start = lookup[endIndex - 1];
    const end = lookup[endIndex];
    const span = end.lineProgress - start.lineProgress;
    const segmentFraction = span > 0 ? (fraction - start.lineProgress) / span : 0;
    const startCoordinates = features[endIndex - 1].geometry.coordinates;
    const endCoordinates = features[endIndex].geometry.coordinates;

    return {
        lng: startCoordinates[0] + (endCoordinates[0] - startCoordinates[0]) * segmentFraction,
        lat: startCoordinates[1] + (endCoordinates[1] - startCoordinates[1]) * segmentFraction,
    };
};

export interface RoutePlacement {
    /**
     * Position snapped onto the route, so an image can sit between recorded points.
     */
    lngLat: LngLat;
    /**
     * Pacing-neutral position along the whole route. Percentage of time or distance
     * is derived from this, never stored.
     */
    distanceFraction: number;
}

interface RoutePlacementCandidate extends RoutePlacement {
    segmentFraction: number;
    pointDistanceMeters: number;
    timeEpoch: number;
}

const DEFAULT_OVERLAP_TOLERANCE_METERS = 25;

/**
 * Snaps a coordinate onto the route. `timeHintEpoch` picks between overlapping
 * passes (a return leg over the same road); without it the nearest pass wins.
 */
export const getRoutePlacement = (
    lngLat: LngLat,
    geojson: GeoJson | undefined,
    routeGeometryData: RouteGeometryData | null | undefined,
    timeHintEpoch?: number,
    overlapToleranceMeters = DEFAULT_OVERLAP_TOLERANCE_METERS,
): RoutePlacement | null => {
    const features = geojson?.features;
    if (!features?.length || !routeGeometryData) {
        return null;
    }

    const firstCoordinates = features[0].geometry.coordinates;
    if (features.length === 1) {
        return {
            lngLat: { lng: firstCoordinates[0], lat: firstCoordinates[1] },
            distanceFraction: 0,
        };
    }

    const inputPoint = turfPoint([lngLat.lng, lngLat.lat]);
    if (timeHintEpoch === undefined) {
        const { snapped, segmentIndex, segmentLength } = getNearestRouteSegment(features, inputPoint);
        const start = features[segmentIndex].geometry.coordinates;
        const coordinates = snapped.geometry.coordinates;
        const segmentFraction = segmentLength > 0 && (coordinates[0] !== start[0] || coordinates[1] !== start[1])
            ? snapped.properties.segmentDistance / segmentLength
            : 0;
        const startProgress = routeGeometryData.lookup[segmentIndex]?.lineProgress ?? 0;
        const endProgress = routeGeometryData.lookup[segmentIndex + 1]?.lineProgress ?? 1;

        return {
            lngLat: { lng: coordinates[0], lat: coordinates[1] },
            distanceFraction: clampZeroOne(startProgress + (endProgress - startProgress) * segmentFraction),
        };
    }
    const candidates: RoutePlacementCandidate[] = [];

    for (let index = 0; index < features.length - 1; index++) {
        const start = features[index].geometry.coordinates;
        const end = features[index + 1].geometry.coordinates;
        const segment = turfLine([start, end]);
        const snapped = nearestPointOnLine(segment, inputPoint, { units: 'meters' });
        const segmentLength = turfDistance(start, end, { units: 'meters' });
        const segmentFraction = segmentLength > 0
            ? snapped.properties.totalDistance / segmentLength
            : 0;
        const startProgress = routeGeometryData.lookup[index]?.lineProgress ?? 0;
        const endProgress = routeGeometryData.lookup[index + 1]?.lineProgress ?? 1;
        const distanceFraction = clampZeroOne(
            startProgress + (endProgress - startProgress) * segmentFraction
        );
        const startTimeEpoch = new Date(features[index].properties.time).valueOf();
        const endTimeEpoch = new Date(features[index + 1].properties.time).valueOf();

        candidates.push({
            lngLat: {
                lng: snapped.geometry.coordinates[0],
                lat: snapped.geometry.coordinates[1],
            },
            distanceFraction,
            segmentFraction,
            pointDistanceMeters: snapped.properties.pointDistance,
            timeEpoch: startTimeEpoch + (endTimeEpoch - startTimeEpoch) * segmentFraction,
        });
    }

    const nearest = candidates.reduce((best, candidate) =>
        candidate.pointDistanceMeters < best.pointDistanceMeters ? candidate : best
    );

    /**
     * Only a projection strictly inside its segment is a local minimum along the
     * route. Endpoint projections belong to the adjacent segment and must not be
     * pulled to a vertex by the time hint.
     */
    const overlapping = candidates.filter((candidate) =>
        candidate === nearest
        || (
            candidate.segmentFraction > 0
            && candidate.segmentFraction < 1
            && candidate.pointDistanceMeters <= nearest.pointDistanceMeters + overlapToleranceMeters
        )
    );
    const best = overlapping.reduce((current, candidate) =>
        Math.abs(candidate.timeEpoch - timeHintEpoch) < Math.abs(current.timeEpoch - timeHintEpoch)
            ? candidate
            : current
    );

    return { lngLat: best.lngLat, distanceFraction: best.distanceFraction };
};

/**
 * Timeline pacing keeps the existing departure-time convention for stationary
 * sections, where a distance fraction maps to the moment the route moves again.
 */
export const getDistanceFractionPercent = (
    distanceFraction: number,
    geojson: GeoJson,
    routeGeometryData: RouteGeometryData,
    startTimeEpoch: number,
    duration: number,
    playbackPacing: PlaybackPacing,
): number => {
    if (playbackPacing === 'distance') {
        return distanceFraction * 100;
    }
    if (duration <= 0) {
        return 0;
    }

    return getRouteTimelinePositionForDistanceFraction(
        geojson,
        routeGeometryData,
        startTimeEpoch,
        distanceFraction,
    ) / duration * 100;
};

export const getRoutePlacementPercent = (
    placement: RoutePlacement,
    geojson: GeoJson,
    routeGeometryData: RouteGeometryData,
    startTimeEpoch: number,
    duration: number,
    playbackPacing: PlaybackPacing,
): number => getDistanceFractionPercent(
    placement.distanceFraction,
    geojson,
    routeGeometryData,
    startTimeEpoch,
    duration,
    playbackPacing,
);
