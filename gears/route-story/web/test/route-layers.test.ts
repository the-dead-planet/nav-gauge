import { expect } from "chai";
import { describe, it } from "mocha";
import { defaultRouteStoryState, getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineGradient, requiresSplitLineGeometry } from "@the-dead-planet/nav-gauge-gears-route-story-common";

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

    it("creates a centered color transition", () => {
        expect(getRouteLineGradient('before', 'red', 'blue', 0.4, 0.2)).to.deep.equal([
            'case', ['<=', ['line-progress'], 0.4], ['interpolate', ['linear'], ['line-progress'], 0.30000000000000004, 'red', 0.5, 'blue'], 'rgba(0, 0, 0, 0)',
        ]);
        expect(getRouteLineGradient('after', 'red', 'blue', 0.4, 0.2)).to.deep.equal([
            'case', ['>', ['line-progress'], 0.4], ['interpolate', ['linear'], ['line-progress'], 0.30000000000000004, 'red', 0.5, 'blue'], 'rgba(0, 0, 0, 0)',
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
});
