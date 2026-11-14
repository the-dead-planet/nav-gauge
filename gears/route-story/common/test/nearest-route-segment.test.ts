import { expect } from 'chai';
import { describe, it } from 'mocha';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { GeoJson } from '@tinker-chest';
import { getRouteGeometryData, getRoutePlacement } from '../src/tinkers';

describe('Cached route snapping', () => {
    const routes = [
        [[0, 0], [0.01, 0.01], [0.01, 0.01], [0.02, 0], [0.01, 0.01], [0, 0]],
        [[179.9, 70], [-179.9, 70], [-179.8, 70.1]],
        [[-170, 10], [5, 20], [120, -30]],
        [[5, 5], [5, 5], [5, 5]],
    ];
    it('matches the full Turf search across return passes, zero-length segments, and the antimeridian after warming the cache', () => {
        for (const coordinates of routes) {
            const route: GeoJson = {
                type: 'FeatureCollection',
                features: coordinates.map((position, id) => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: position },
                    properties: { id, time: new Date(id * 1000).toISOString() },
                })),
            };
            const geometry = getRouteGeometryData(route);
            const probes = [...coordinates, [0.005, 0.006], [-179.85, 70.05], [75, -75], [170, 80]];
            for (const coordinate of [...probes, ...probes.slice().reverse()]) {
                const expected = nearestPointOnLine(lineString(coordinates), point(coordinate), { units: 'meters' });
                const actual = getRoutePlacement({ lng: coordinate[0], lat: coordinate[1] }, route, geometry)!;
                expect(actual.lngLat.lng).to.be.closeTo(expected.geometry.coordinates[0], 1e-10);
                expect(actual.lngLat.lat).to.be.closeTo(expected.geometry.coordinates[1], 1e-10);
                const fraction = geometry.totalDistanceMeters > 0 ? expected.properties.totalDistance / geometry.totalDistanceMeters : 0;
                expect(actual.distanceFraction).to.be.closeTo(fraction, 1e-10);
            }
        }
    });
});
