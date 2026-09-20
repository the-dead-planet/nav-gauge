import { describe } from "mocha";
import { expect } from "chai";
import { getRouteSourceData, getRouteTimelinePositionForDistanceFraction, getSplineData, getSplineHeading } from "../src/tinkers";
import { GeoJson } from "@tinker-chest";
const route: GeoJson = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [1, 1] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [2, 2] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
    ],
};

const startTimeEpoch = Date.parse("2026-01-01T00:00:00Z");
const getRouteFrame = (routeTimelinePositionMs: number) => getRouteSourceData({
    geojson: route,
    startTimeEpoch,
    routeTimelinePositionMs,
    splineData: getSplineData(route),
});

describe("Route story gear", () => {
    describe("Route source data", () => {
        const expectValidLines = (routeTimelinePositionMs: number) => {
            const { line } = getRouteFrame(routeTimelinePositionMs);
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
            const { line } = getRouteFrame(90_000);
            const features = (line as GeoJSON.FeatureCollection).features;
            const lineStrings = features
                .filter((f): f is GeoJSON.Feature<GeoJSON.LineString> => f.geometry.type === "LineString");
            expect(lineStrings).to.have.lengthOf(2);
            expect(lineStrings[0].geometry.coordinates.length).to.be.greaterThan(1);
            expect(lineStrings[1].geometry.coordinates.length).to.be.greaterThan(1);
            expect(features.filter((feature) => feature.geometry.type === 'Point' && feature.properties?.status).map((feature) => feature.properties?.status)).to.deep.equal(['before', 'before', 'after']);
            const currentPoint = features.find((feature) => feature.properties?.routeCurrentPoint) as GeoJSON.Feature<GeoJSON.Point>;
            expect(currentPoint.geometry.coordinates).to.deep.equal(lineStrings[0].geometry.coordinates.at(-1));
            expect(currentPoint.geometry.coordinates).to.deep.equal(lineStrings[1].geometry.coordinates[0]);
        });

        it("reports the fraction of route distance travelled", () => {
            const { routeDistanceFraction } = getRouteFrame(90_000);

            expect(routeDistanceFraction).to.be.closeTo(0.75, 0.001);
        });

        it("converts distance progress back to route timeline progress", () => {
            const splineData = {
                ...getSplineData(route),
                lookup: [
                    { t: 0, lineProgress: 0 },
                    { t: 0.5, lineProgress: 0.25 },
                    { t: 1, lineProgress: 1 },
                ],
            };

            expect(getRouteTimelinePositionForDistanceFraction(route, splineData, startTimeEpoch, 0.625)).to.equal(90_000);
        });

        it("provides finite headings at both route ends", () => {
            expect(getRouteFrame(0).heading).to.be.finite;
            expect(getRouteFrame(120_000).heading).to.be.finite;
        });
    });

    describe("Spline heading", () => {
        it("should follow the route direction for a straight north-east route", () => {
            const splineData = getSplineData(route);
            const heading = getSplineHeading(splineData, 2, 0.5);
            expect(heading).to.be.closeTo(45, 1);
        });
    });
});
