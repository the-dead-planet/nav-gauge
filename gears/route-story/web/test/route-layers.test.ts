import { expect } from "chai";
import { describe, it } from "mocha";
import type * as maplibregl from "maplibre-gl";
import { defaultRouteStoryState, requiresSplitLineGeometry } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayerStyle } from "../src/tinkers";

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

    it("requires split geometry when either line is dashed", () => {
        expect(requiresSplitLineGeometry(defaultRouteStoryState)).to.equal(true);
        expect(requiresSplitLineGeometry({
            ...defaultRouteStoryState,
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' },
        })).to.equal(false);
    });
});