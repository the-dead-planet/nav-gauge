import { describe } from "mocha";
import { expect } from "chai";
import { getRouteSourceData, getRouteTimelinePositionForDistanceFraction, getSplineData, getSplineHeading, getStaticRouteSourceData } from "../src/tinkers";
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
const getRouteFrame = (
    routeTimelinePositionMs: number,
    { createSplitLineGeometry = true }: { createSplitLineGeometry?: boolean } = {},
) => getRouteSourceData({
    geojson: route,
    startTimeEpoch,
    routeTimelinePositionMs,
    splineData: getSplineData(route),
    createSplitLineGeometry,
});

describe("Route story gear", () => {
    describe("Route source data", () => {
        const splineData = getSplineData(route);
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
            expect(features.filter((feature) => feature.geometry.type === 'Point').map((feature) => feature.properties?.status)).to.deep.equal(['before', 'before', 'after']);
        });

        it("should report the index of the segment that follows the current time", () => {
            const { splitIndex } = getRouteFrame(90_000);
            expect(splitIndex).to.equal(2);
        });

        it("reports the fraction of route distance travelled", () => {
            const { routeDistanceFraction } = getRouteFrame(90_000, { createSplitLineGeometry: false });

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

        it("creates static line and point features from the route", () => {
            const source = getStaticRouteSourceData(route, splineData);

            expect((source.features[0].geometry as GeoJSON.LineString).coordinates).to.deep.equal([[0, 0], [1, 1], [2, 2]]);
            const pointFractions = source.features.slice(1).map((feature) => feature.properties?.routeDistanceFraction as number);
            expect(pointFractions[0]).to.equal(0);
            expect(pointFractions[1]).to.be.closeTo(0.5, 0.001);
            expect(pointFractions[2]).to.equal(1);
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
