import { expect } from "chai";
import { findThumbnailsWithinBuffer } from "../src/tinkers";
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

describe("Mobile route story gear", () => {
    describe("Example test", () => {
        it("should be equal 1", () => {
            const features = findThumbnailsWithinBuffer([100.851959, 1.190170], 15, [
                {
                    id: 0,
                    lngLat: { lng: 104.951959, lat: 1.360270 },
                    featureId: 1,
                    data: { fullSize: '', thumbnail: '', uri: '' },
                    name: 'foo'
                },
                {
                    id: 1,
                    lngLat: { lng: 103.851959, lat: 1.850270 },
                    featureId: 2,
                    data: { fullSize: '', thumbnail: '', uri: '' },
                    name: 'bar'
                },
            ], geojson, { devicePixelRatio: 1 });
            expect(features).to.deep.equal([geojson.features[2]]);
        });
    });
});