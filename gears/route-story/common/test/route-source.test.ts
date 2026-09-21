import { describe } from "mocha";
import { expect } from "chai";
import { getPosition, getRouteDistanceFraction, getRouteGeometryData, getRouteSourceData, getRouteTimelinePositionForDistanceFraction, getSplineHeading } from "../src/tinkers";
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
    routeStyleActive: {
        showRouteLine: true,
        showRoutePoints: false,
        pointColor: 'red',
        pointRadius: 3,
        color: 'red',
        width: 2,
        outlineColor: 'black',
        outlineWidth: 0,
        variant: 'solid',
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
        variant: 'dashed',
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
            expect(getPosition(2, route, routeTimes, 'distance', routeGeometryData)).to.equal(25);
            expect(getPosition(2, route, routeTimes, 'timeline', routeGeometryData)).to.equal(50);
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
});
