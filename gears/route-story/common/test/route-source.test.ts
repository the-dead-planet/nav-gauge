import { describe } from "mocha";
import { expect } from "chai";
import { getDistanceFractionPercent, getRouteDistanceFraction, getRouteGeometryData, getRoutePlacement, getRoutePlacementPercent, getRouteSourceData, getRouteTimelinePositionForDistanceFraction, getSplineHeading, getRouteLngLatAtDistanceFraction } from "../src/tinkers";
import { GeoJson } from "@tinker-chest";
import { RouteStoryState } from "../src";
const route: GeoJson = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [1, 1] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [2, 2] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
    ],
};

const state: RouteStoryState = {
    markerPlayerVisibility: true,
    markerLayerVisibility: true,
    routeStyleActive: {
        showRouteLine: true,
        showRoutePoints: false,
        pointColor: 'red',
        pointRadius: 3,
        color: 'red',
        width: 2,
        outlineColor: 'black',
        outlineWidth: 0,
        lineStyle: 'solid',
        colorTransitionLengthPixels: 0,
    },
    routeStyleInactive: {
        showRouteLine: true,
        showRoutePoints: false,
        pointColor: 'red',
        pointRadius: 3,
        color: 'red',
        width: 1,
        outlineColor: 'black',
        outlineWidth: 0,
        lineStyle: 'dashed',
        colorTransitionLengthPixels: 0,
    },
    currentPoint: {
        fillColor: 'blue',
        size: 1,
        icon: 'Circle',
        autoRotate: true,
        rotation: 0,
        rotationAlignment: 'map',
    }
};
const startTimeEpoch = Date.parse("2026-01-01T00:00:00Z");
const routeTimes = {
    startTime: "2026-01-01T00:00:00Z",
    endTime: "2026-01-01T00:02:00Z",
    startTimeEpoch,
    endTimeEpoch: startTimeEpoch + 120_000,
    duration: 120_000,
};

describe("Route story gear", () => {
    describe("Route source data", () => {
        const routeGeometryData = getRouteGeometryData(route);
        const expectValidLines = (progressMs: number) => {
            const { line } = getRouteSourceData(state, route, startTimeEpoch, progressMs, routeGeometryData);
            expect(line.type).to.equal("FeatureCollection");
            for (const feature of (line as GeoJSON.FeatureCollection).features) {
                if (feature.geometry.type === "LineString") {
                    expect(feature.geometry.coordinates.length).to.be.greaterThan(1);
                }
            }
        };

        it("should produce no single-point line at route start", () => {
            expectValidLines(0);
        });

        it("should produce two valid lines mid-route", () => {
            const { line } = getRouteSourceData(state, route, startTimeEpoch, 90_000, routeGeometryData);
            const lineStrings = (line as GeoJSON.FeatureCollection).features
                .filter((f): f is GeoJSON.Feature<GeoJSON.LineString> => f.geometry.type === "LineString");
            expect(lineStrings).to.have.lengthOf(2);
            expect(lineStrings[0].geometry.coordinates.length).to.be.greaterThan(1);
            expect(lineStrings[1].geometry.coordinates.length).to.be.greaterThan(1);
        });

        it("should report the index of the segment that follows the current time", () => {
            const { splitIndex } = getRouteSourceData(state, route, startTimeEpoch, 90_000, routeGeometryData);
            expect(splitIndex).to.equal(2);
        });

        it("converts route distance progress to timeline progress", () => {
            const routeGeometryData = {
                ...getRouteGeometryData(route),
                lookup: [
                    { t: 0, lineProgress: 0 },
                    { t: 0.5, lineProgress: 0.25 },
                    { t: 1, lineProgress: 1 },
                ],
                totalDistanceMeters: 100,
            };

            expect(getRouteTimelinePositionForDistanceFraction(route, routeGeometryData, startTimeEpoch, 0.625)).to.equal(90_000);
            expect(getRouteDistanceFraction(90_000, route, routeTimes, routeGeometryData)).to.equal(0.625);
            expect(getDistanceFractionPercent(0.25, route, routeGeometryData, startTimeEpoch, routeTimes.duration, 'distance')).to.equal(25);
            expect(getDistanceFractionPercent(0.25, route, routeGeometryData, startTimeEpoch, routeTimes.duration, 'timeline')).to.equal(50);
        });

        it("provides finite headings at both route ends", () => {
            expect(getRouteSourceData(state, route, startTimeEpoch, 0, routeGeometryData).heading).to.be.finite;
            expect(getRouteSourceData(state, route, startTimeEpoch, 120_000, routeGeometryData).heading).to.be.finite;
        });
    });

    describe("Spline heading", () => {
        it("should follow the route direction for a straight north-east route", () => {
            const routeGeometryData = getRouteGeometryData(route);
            const heading = getSplineHeading(routeGeometryData, 2, 0.5);
            expect(heading).to.be.closeTo(45, 1);
        });
    });

    describe("Route placement", () => {
        it("places an image between recorded points", () => {
            const routeGeometryData = getRouteGeometryData(route);
            const placement = getRoutePlacement({ lng: 0.5, lat: 0.5 }, route, routeGeometryData);

            expect(placement).to.not.equal(null);
            expect(placement!.distanceFraction).to.be.closeTo(0.25, 0.001);
            expect(placement!.lngLat.lng).to.be.closeTo(0.5, 0.001);
            expect(placement!.lngLat.lat).to.be.closeTo(0.5, 0.001);
        });

        it("recovers the route coordinate from a distance fraction", () => {
            const routeGeometryData = getRouteGeometryData(route);
            const lngLat = getRouteLngLatAtDistanceFraction(route, routeGeometryData, 0.5);

            expect(lngLat.lng).to.be.closeTo(1, 0.001);
            expect(lngLat.lat).to.be.closeTo(1, 0.001);
        });

        it("snaps route vertices to their matching distance fractions", () => {
            const routeGeometryData = getRouteGeometryData(route);
            for (const [index, feature] of route.features.entries()) {
                const [lng, lat] = feature.geometry.coordinates;
                const placement = getRoutePlacement({ lng, lat }, route, routeGeometryData)!;
                expect(placement.lngLat).to.deep.equal({ lng, lat });
                expect(placement.distanceFraction).to.be.closeTo(routeGeometryData.lookup[index].lineProgress, 1e-10);
            }
        });

        it("uses the route end when the distance fraction exceeds the final lookup entry", () => {
            const geometry = getRouteGeometryData(route);
            const routeGeometryData = {
                ...geometry,
                lookup: geometry.lookup.map((entry) => ({ ...entry, lineProgress: entry.lineProgress * 0.99 })),
            };
            expect(getRouteLngLatAtDistanceFraction(route, routeGeometryData, 1)).to.deep.equal({ lng: 2, lat: 2 });
        });

        it("derives timeline and distance percentages from the same placement", () => {
            const routeGeometryData = {
                ...getRouteGeometryData(route),
                lookup: [
                    { t: 0, lineProgress: 0 },
                    { t: 0.5, lineProgress: 0.25 },
                    { t: 1, lineProgress: 1 },
                ],
                totalDistanceMeters: 100,
            };
            const placement = getRoutePlacement({ lng: 0.5, lat: 0.5 }, route, routeGeometryData)!;

            expect(placement.distanceFraction).to.be.closeTo(0.125, 0.001);
            expect(getRoutePlacementPercent(placement, route, routeGeometryData, startTimeEpoch, routeTimes.duration, 'distance'))
                .to.be.closeTo(12.5, 0.01);
            expect(getRoutePlacementPercent(placement, route, routeGeometryData, startTimeEpoch, routeTimes.duration, 'timeline'))
                .to.be.closeTo(25, 0.01);
        });

        it("uses an EXIF time hint to choose between overlapping route passes", () => {
            const outAndBack: GeoJson = {
                type: "FeatureCollection",
                features: [
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.01] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0.00005, 0] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
                ],
            };
            const routeGeometryData = getRouteGeometryData(outAndBack);
            const imageLngLat = { lng: 0.00001, lat: 0.003 };

            const nearest = getRoutePlacement(imageLngLat, outAndBack, routeGeometryData)!;
            expect(nearest.distanceFraction).to.be.closeTo(0.15, 0.02);

            const hinted = getRoutePlacement(imageLngLat, outAndBack, routeGeometryData, Date.parse("2026-01-01T00:01:42Z"))!;
            expect(hinted.distanceFraction).to.be.closeTo(0.85, 0.02);
        });

        it("still distinguishes exactly overlapping out-and-back passes", () => {
            const outAndBack: GeoJson = {
                type: "FeatureCollection",
                features: [
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.01] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
                ],
            };
            const routeGeometryData = getRouteGeometryData(outAndBack);
            const imageLngLat = { lng: 0, lat: 0.003 };

            const nearest = getRoutePlacement(imageLngLat, outAndBack, routeGeometryData)!;
            expect([0.15, 0.85].some((fraction) => Math.abs(nearest.distanceFraction - fraction) < 0.02)).to.equal(true);

            const hinted = getRoutePlacement(imageLngLat, outAndBack, routeGeometryData, Date.parse("2026-01-01T00:01:42Z"))!;
            expect(hinted.distanceFraction).to.be.closeTo(0.85, 0.02);
        });

        it("does not let a timestamp hint drag an image to a nearby vertex", () => {
            const straightRoute: GeoJson = {
                type: "FeatureCollection",
                features: [
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.0009] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.0018] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
                ],
            };
            const routeGeometryData = getRouteGeometryData(straightRoute);
            const imageLngLat = { lng: 0.00002, lat: 0.00081 };

            const nearest = getRoutePlacement(imageLngLat, straightRoute, routeGeometryData)!;
            expect(nearest.distanceFraction).to.be.closeTo(0.45, 0.005);

            const hinted = getRoutePlacement(imageLngLat, straightRoute, routeGeometryData, Date.parse("2026-01-01T00:01:00Z"))!;
            expect(hinted.distanceFraction).to.be.closeTo(0.45, 0.005);
        });

        it("keeps stationary sections stable across pacing modes", () => {
            const stationaryRoute: GeoJson = {
                type: "FeatureCollection",
                features: [
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.001] }, properties: { id: 2, time: "2026-01-01T00:00:30Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.001] }, properties: { id: 3, time: "2026-01-01T00:01:30Z" } },
                    { type: "Feature", geometry: { type: "Point", coordinates: [0, 0.002] }, properties: { id: 4, time: "2026-01-01T00:02:00Z" } },
                ],
            };
            const routeGeometryData = {
                ...getRouteGeometryData(route),
                lookup: [
                    { t: 0, lineProgress: 0 },
                    { t: 0.5, lineProgress: 0.5 },
                    { t: 0.5, lineProgress: 0.5 },
                    { t: 1, lineProgress: 1 },
                ],
                totalDistanceMeters: 100,
            };
            const placement = getRoutePlacement({ lng: 0, lat: 0.001 }, stationaryRoute, routeGeometryData)!;

            expect(placement.distanceFraction).to.be.closeTo(0.5, 0.001);
            expect(getRoutePlacementPercent(placement, stationaryRoute, routeGeometryData, startTimeEpoch, routeTimes.duration, 'distance'))
                .to.be.closeTo(50, 0.01);
            expect(getRoutePlacementPercent(placement, stationaryRoute, routeGeometryData, startTimeEpoch, routeTimes.duration, 'timeline'))
                .to.be.closeTo(75, 0.01);
        });
    });
});
