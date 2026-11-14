import distance from '@turf/distance';
import { earthRadius, lineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { GeoJson } from '@tinker-chest';

type Vector = [number, number, number];
interface Segment {
    line: GeoJSON.Feature<GeoJSON.LineString>;
    length: number;
    midpoint: Vector | null;
    radius: number;
    cosine: number;
    sine: number;
}
interface RouteIndex {
    segments: Segment[];
    nearestIndex: number;
}

const indexes = new WeakMap<GeoJson['features'], RouteIndex>();
const vector = ([longitude, latitude]: number[]): Vector => {
    const longitudeRadians = longitude * Math.PI / 180;
    const latitudeRadians = latitude * Math.PI / 180;
    const cosine = Math.cos(latitudeRadians);
    return [cosine * Math.cos(longitudeRadians), cosine * Math.sin(longitudeRadians), Math.sin(latitudeRadians)];
};
const dot = (first: Vector, second: Vector): number => first[0] * second[0] + first[1] * second[1] + first[2] * second[2];

/** Spherical bounds reject distant segments; Turf still performs the exact snap. */
export const getNearestRouteSegment = (features: GeoJson['features'], point: GeoJSON.Feature<GeoJSON.Point>) => {
    let index = indexes.get(features);
    if (!index) {
        const vectors = features.map((feature) => vector(feature.geometry.coordinates));
        const segments = features.slice(0, -1).map((feature, position): Segment => {
            const first = vectors[position];
            const second = vectors[position + 1];
            const length = Math.hypot(first[0] + second[0], first[1] + second[1], first[2] + second[2]);
            const cosine = Math.sqrt(Math.max(0, (1 + Math.max(-1, Math.min(1, dot(first, second)))) / 2));
            return {
                line: lineString([feature.geometry.coordinates, features[position + 1].geometry.coordinates]),
                length: distance(feature.geometry.coordinates, features[position + 1].geometry.coordinates, { units: 'meters' }),
                midpoint: length > 1e-12 ? [(first[0] + second[0]) / length, (first[1] + second[1]) / length, (first[2] + second[2]) / length] : null,
                radius: Math.acos(cosine),
                cosine,
                sine: Math.sqrt(Math.max(0, 1 - cosine * cosine)),
            };
        });
        index = { segments, nearestIndex: Math.floor(segments.length / 2) };
        indexes.set(features, index);
    }

    const input = vector(point.geometry.coordinates);
    let nearestIndex = index.nearestIndex;
    let snapped = nearestPointOnLine(index.segments[nearestIndex].line, point, { units: 'meters' });
    let angularDistance = snapped.properties.pointDistance / earthRadius;
    let cosine = Math.cos(angularDistance);
    let sine = Math.sin(angularDistance);
    for (const [position, segment] of index.segments.entries()) {
        if (position === nearestIndex) {
            continue;
        }
        if (segment.midpoint && angularDistance + segment.radius < Math.PI && dot(input, segment.midpoint) + 1e-12 < cosine * segment.cosine - sine * segment.sine) {
            continue;
        }
        const candidate = nearestPointOnLine(segment.line, point, { units: 'meters' });
        if (candidate.properties.pointDistance < snapped.properties.pointDistance || (candidate.properties.pointDistance === snapped.properties.pointDistance && position < nearestIndex)) {
            nearestIndex = position;
            snapped = candidate;
            angularDistance = candidate.properties.pointDistance / earthRadius;
            cosine = Math.cos(angularDistance);
            sine = Math.sin(angularDistance);
        }
    }
    index.nearestIndex = nearestIndex;
    return { snapped, segmentIndex: nearestIndex, segmentLength: index.segments[nearestIndex].length };
};
