import { expect } from "chai";
import { describe, it } from "mocha";
import type * as maplibregl from "maplibre-gl";
import { defaultRouteStoryState, getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineGradient, requiresSplitLineGeometry, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer, updateRouteLayerStyle } from "../src/tinkers";

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

    it("waits for the current point before advancing static route progress", () => {
        let sourceDataListener: ((event: maplibregl.MapSourceDataEvent) => void) | undefined;
        let renderListener: (() => void) | undefined;
        const sourceUpdates: GeoJSON.GeoJSON[] = [];
        const gradients: unknown[] = [];
        const source = { setData: (data: GeoJSON.GeoJSON) => sourceUpdates.push(data) };
        const map = {
            getLayer: () => ({}),
            getSource: (sourceId: string) => sourceId === routeSourceIds.currentPoint ? source : undefined,
            on: (_event: string, listener: (event: maplibregl.MapSourceDataEvent) => void) => { sourceDataListener = listener; },
            once: (_event: string, listener: () => void) => { renderListener = listener; },
            off: () => undefined,
            setFilter: () => undefined,
            setPaintProperty: (_layerId: string, property: string, value: unknown) => {
                if (property === 'line-gradient') gradients.push(value);
            },
        } as unknown as maplibregl.Map;
        const state = {
            ...defaultRouteStoryState,
            routeStyleActive: { ...defaultRouteStoryState.routeStyleActive, variant: 'solid' as const },
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' as const },
        };
        const currentPoint: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {},
        };
        const update = (routeDistanceFraction: number) => updateRouteLayer({
            map,
            currentPoint,
            line: { type: 'FeatureCollection', features: [] },
            routeDistanceFraction,
            createSplitLineGeometry: false,
            state,
        });

        update(0.2);
        update(0.8);

        expect(sourceUpdates).to.have.length(1);
        expect(gradients).to.be.empty;

        sourceDataListener?.({ sourceId: routeSourceIds.currentPoint, isSourceLoaded: true } as maplibregl.MapSourceDataEvent);
        expect(sourceUpdates).to.have.length(1);
        expect(JSON.stringify(gradients)).to.include('0.2');

        renderListener?.();
        expect(sourceUpdates).to.have.length(2);
        sourceDataListener?.({ sourceId: routeSourceIds.currentPoint, isSourceLoaded: true } as maplibregl.MapSourceDataEvent);
        expect(JSON.stringify(gradients)).to.include('0.8');
    });

    it("renders split line and current point source updates together", () => {
        let sourceDataListener: ((event: maplibregl.MapSourceDataEvent) => void) | undefined;
        let renderListener: (() => void) | undefined;
        const sourceUpdates = new Map<string, GeoJSON.GeoJSON[]>();
        const getSource = (sourceId: string) => ({
            setData: (data: GeoJSON.GeoJSON) => sourceUpdates.set(sourceId, [...sourceUpdates.get(sourceId) ?? [], data]),
        });
        const map = {
            getSource,
            on: (_event: string, listener: (event: maplibregl.MapSourceDataEvent) => void) => { sourceDataListener = listener; },
            once: (_event: string, listener: () => void) => { renderListener = listener; },
            off: () => undefined,
        } as unknown as maplibregl.Map;
        const currentPoint: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {},
        };
        const update = (routeDistanceFraction: number) => updateRouteLayer({
            map,
            currentPoint,
            line: { type: 'FeatureCollection', features: [] },
            routeDistanceFraction,
            createSplitLineGeometry: true,
            state: defaultRouteStoryState,
        });

        update(0.2);
        update(0.8);
        expect(sourceUpdates.get(routeSourceIds.currentPoint)).to.have.length(1);
        expect(sourceUpdates.get(routeSourceIds.line)).to.have.length(1);

        sourceDataListener?.({ sourceId: routeSourceIds.currentPoint, isSourceLoaded: true } as maplibregl.MapSourceDataEvent);
        expect(renderListener).to.equal(undefined);
        sourceDataListener?.({ sourceId: routeSourceIds.line, isSourceLoaded: true } as maplibregl.MapSourceDataEvent);
        expect(renderListener).not.to.equal(undefined);

        renderListener?.();
        expect(sourceUpdates.get(routeSourceIds.currentPoint)).to.have.length(2);
        expect(sourceUpdates.get(routeSourceIds.line)).to.have.length(2);
    });
});
