import { expect } from "chai";
import { describe, it } from "mocha";
import type * as maplibregl from "maplibre-gl";
import { defaultRouteStoryState, getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineGradient, requiresSplitLineGeometry } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayerStyle } from "../src/tinkers";

describe("Web route line layers", () => {
    it("creates complementary active and inactive distance masks", () => {
        expect(getRouteLineGradient('before', 'red', 'blue', 0.4, 0)).to.deep.equal([
            'step', ['line-progress'], 'red', 0.4, 'rgba(0, 0, 0, 0)',
        ]);
        expect(getRouteLineGradient('after', 'red', 'blue', 0.4, 0)).to.deep.equal([
            'step', ['line-progress'], 'rgba(0, 0, 0, 0)', 0.4, 'blue',
        ]);
    });

    it("omits feature filters from the static route layers", () => {
        for (const layer of getProgressRouteLineLayers(defaultRouteStoryState, 0.4)) {
            expect(layer).not.to.have.property('filter');
        }
    });

    it("creates a color transition trailing the current point", () => {
        expect(getRouteLineGradient('before', 'red', 'blue', 0.4, 0.2)).to.deep.equal([
            'case', ['<=', ['line-progress'], 0.4], ['interpolate', ['linear'], ['line-progress'], 0.2, 'red', 0.4, 'blue'], 'rgba(0, 0, 0, 0)',
        ]);
        expect(getRouteLineGradient('after', 'red', 'blue', 0.4, 0.2)).to.deep.equal([
            'case', ['>', ['line-progress'], 0.4], ['interpolate', ['linear'], ['line-progress'], 0.2, 'red', 0.4, 'blue'], 'rgba(0, 0, 0, 0)',
        ]);
    });

    it("requires split geometry when either line is dashed", () => {
        expect(requiresSplitLineGeometry(defaultRouteStoryState)).to.equal(true);
        expect(requiresSplitLineGeometry({
            ...defaultRouteStoryState,
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' },
        })).to.equal(false);
    });

    it("filters static point features by distance", () => {
        const layers = getProgressRoutePointsLayers({
            ...defaultRouteStoryState,
            routeStyleActive: { ...defaultRouteStoryState.routeStyleActive, showRoutePoints: true },
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, showRoutePoints: true },
        }, 0.4);

        expect(layers.map((layer) => layer.filter)).to.deep.equal([
            ['<=', ['get', 'routeDistanceFraction'], 0.4],
            ['>', ['get', 'routeDistanceFraction'], 0.4],
        ]);
    });

    it("updates popup styling through map properties", () => {
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

        updateRouteLayerStyle(map, state, 0.4, false);

        expect(updates).to.include.members(['visibility', 'line-gradient', 'line-width', 'circle-color', 'circle-radius']);
    });
});
