import { expect } from "chai";
import { describe, it } from "mocha";
import type * as maplibregl from "maplibre-gl";
import { defaultRouteStoryState, getAnimatedRouteLineLayers, requiresSplitLineGeometry, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer, updateRouteLayerStyle } from "../src/tinkers";

describe("Web route line layers", () => {
    it("creates a color transition trailing the current point", () => {
        const state = {
            ...defaultRouteStoryState,
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' as const },
            currentPoint: { ...defaultRouteStoryState.currentPoint, colorTransitionLengthPercent: 20 },
        };
        const activeLayer = getAnimatedRouteLineLayers(state, 0.4).find((layer) => layer.id === 'route-line-active');

        expect(activeLayer?.paint['line-gradient']).to.deep.equal([
            'interpolate', ['linear'], ['line-progress'], 0.5, state.routeStyleActive.color, 1, state.routeStyleInactive.color,
        ]);
    });

    it("requires split geometry when either line is dashed", () => {
        expect(requiresSplitLineGeometry(defaultRouteStoryState)).to.equal(true);
        expect(requiresSplitLineGeometry({
            ...defaultRouteStoryState,
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' },
        })).to.equal(false);
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

        updateRouteLayerStyle(map, state, 0.4);

        expect(updates).to.include.members(['visibility', 'line-gradient', 'line-width', 'circle-color', 'circle-radius']);
    });

    it("keeps only the latest frame while the route source is processing", () => {
        const sourceUpdates: GeoJSON.GeoJSON[] = [];
        const handlers = new Map<string, (...arguments_: unknown[]) => void>();
        const source = { setData: (data: GeoJSON.GeoJSON) => { sourceUpdates.push(data); } };
        const map = {
            getLayer: () => undefined,
            getSource: (sourceId: string) => sourceId === routeSourceIds.line ? source : undefined,
            on: (event: string, handler: (...arguments_: unknown[]) => void) => handlers.set(event, handler),
            off: (event: string) => handlers.delete(event),
            once: (event: string, handler: (...arguments_: unknown[]) => void) => handlers.set(event, handler),
            setFilter: () => undefined,
        } as unknown as maplibregl.Map;
        const update = (routeDistanceFraction: number) => {
            const line: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [routeDistanceFraction, 0] }, properties: {} }],
            };
            updateRouteLayer({
                map,
                line,
                routeDistanceFraction,
                state: defaultRouteStoryState,
            });
        };

        update(0.2);
        update(0.4);
        update(0.8);

        expect(sourceUpdates).to.have.length(1);
        handlers.get('sourcedata')?.({ sourceId: routeSourceIds.line, isSourceLoaded: true });
        handlers.get('render')?.();

        expect(sourceUpdates).to.have.length(2);
        expect((sourceUpdates[1] as GeoJSON.FeatureCollection).features[0].geometry).to.deep.equal({ type: 'Point', coordinates: [0.8, 0] });
    });
});
