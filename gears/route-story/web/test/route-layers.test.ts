import { expect } from "chai";
import { describe, it } from "mocha";
import type * as maplibregl from "maplibre-gl";
import { defaultRouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer, updateRouteLayerStyle } from "../src/tinkers";

describe("Web route line layers", () => {
    it("applies popup styling through map properties without re-adding layers", () => {
        const updates: string[] = [];
        const map = {
            getLayer: () => ({}),
            setFilter: () => undefined,
            setLayoutProperty: (_layerId: string, property: string) => updates.push(property),
            setPaintProperty: (_layerId: string, property: string) => updates.push(property),
        } as unknown as maplibregl.Map;
        const state = {
            ...defaultRouteStoryState,
            routeStyleActive: { ...defaultRouteStoryState.routeStyleActive, variant: 'solid' as const },
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' as const },
        };

        updateRouteLayerStyle(map, state);

        expect(updates).to.include.members(['visibility', 'line-color', 'line-width', 'line-dasharray', 'circle-color', 'circle-radius']);
    });

    it("updates the gradient when route data changes", () => {
        const gradients: unknown[] = [];
        const map = {
            getSource: () => ({ setData: () => undefined }),
            getZoom: () => 10,
            setPaintProperty: (_layerId: string, property: string, value: unknown) => {
                if (property === 'line-gradient') gradients.push(value);
            },
        } as unknown as maplibregl.Map;
        const line: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: { status: 'before' },
                geometry: { type: 'LineString', coordinates: [[0, 0], [1, 0]] },
            }],
        };
        const currentPoint: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: [1, 0] },
        };
        const state = {
            ...defaultRouteStoryState,
            routeStyleActive: {
                ...defaultRouteStoryState.routeStyleActive,
                colorTransitionLengthPixels: 100,
            },
        };

        updateRouteLayer(map, line, currentPoint, state);

        expect(gradients).to.have.length(2);
        expect(gradients.every(Boolean)).to.equal(true);
    });
});
