import { expect } from "chai";
import { describe } from "mocha";
import { Cartomancer } from "../../src/index.js";
import { GeoJson } from "@tinker-chest";

const geojson: GeoJson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [103.851959, 1.290270],
            },
            properties: {
                id: 0,
                time: "2026-03-24T07:16:34.786Z"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [104.851959, 1.350270],
            },
            properties: {
                id: 1,
                time: "2026-03-25T07:16:34.786Z"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [100.851959, 1.190270],
            },
            properties: {
                id: 2,
                time: "2026-03-26T07:16:34.786Z"
            }
        },
    ],
};

describe("Cartomancer", () => {
    describe("Closest feature", () => {
        it("should get correct buffer in meters for a latitude and zoom", () => {
            const closestFeature = Cartomancer.getClosestFeature(geojson, { lng: 99.123456, lat: 1.123456 });
            const expected = geojson.features[2];
            
            expect(closestFeature).to.deep.equal([expected.properties.id, expected]);
        });
    });

    describe("Buffer", () => {
        it("should get correct buffer in meters for a latitude and zoom", () => {
            expect(Cartomancer.getBufferInMeters(52, 13)).to.be.equal(47);
        });
        it("should get correct buffer in meters for a latitude and zoom with added offset", () => {
            expect(Cartomancer.getBufferInMeters(52, 18, 10)).to.be.equal(5);
        });
    });
});
