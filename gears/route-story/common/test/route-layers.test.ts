import { expect } from "chai";
import { describe, it } from "mocha";
import { defaultRouteStoryState, getColorTransitionLengthPercent, getCurrentPointLayers, getRouteLineLayers, getRoutePointsLayers, routeLayerIds } from "../src";
import type { RouteStoryState } from "../src";

describe("Route point layers", () => {
    it("uses each route part's point color and radius", () => {
        const layers = getRoutePointsLayers({
            ...defaultRouteStoryState,
            routeStyleActive: {
                ...defaultRouteStoryState.routeStyleActive,
                showRoutePoints: true,
                pointColor: 'red',
                pointRadius: 4,
            },
            routeStyleInactive: {
                ...defaultRouteStoryState.routeStyleInactive,
                showRoutePoints: true,
                pointColor: 'blue',
                pointRadius: 6,
            },
        });

        expect(layers.map((layer) => [layer.id, layer.paint['circle-color'], layer.paint['circle-radius']])).to.deep.equal([
            [routeLayerIds.pointsActive, ['case', ['==', ['feature-state', 'highlight'], true], 'red', ['==', ['get', 'status'], 'before'], 'red', 'blue'], 4],
            [routeLayerIds.pointsInactive, ['case', ['==', ['feature-state', 'highlight'], true], 'red', ['==', ['get', 'status'], 'before'], 'red', 'blue'], 6],
        ]);
    });
});

describe("Route line layers", () => {
    it("keeps hidden lines installed for style-only updates", () => {
        const layers = getRouteLineLayers({
            ...defaultRouteStoryState,
            routeStyleActive: { ...defaultRouteStoryState.routeStyleActive, showRouteLine: false },
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, outlineWidth: 0 },
        });

        expect(layers).to.have.length(4);
        expect(layers.find((layer) => layer.id === routeLayerIds.lineActive)?.layout.visibility).to.equal('none');
        expect(layers.find((layer) => layer.id === routeLayerIds.lineInactiveOutline)?.layout.visibility).to.equal('none');
    });
});

describe("Route line gradient", () => {
    const gradientState = {
        ...defaultRouteStoryState,
        routeStyleActive: {
            ...defaultRouteStoryState.routeStyleActive,
            variant: 'solid' as const,
            colorTransitionLengthPixels: 25,
        },
        routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' as const },
    };
    const activeParts = (state: RouteStoryState) => getRouteLineLayers(
        state,
        state.routeStyleActive.colorTransitionLengthPixels,
    ).filter((layer) =>
        layer.id === routeLayerIds.lineActive || layer.id === routeLayerIds.lineActiveOutline);

    it("fades the active line and outline to the inactive colors at the current point end", () => {
        const [outline, line] = activeParts(gradientState);

        expect(line.paint['line-gradient']).to.deep.equal([
            'interpolate', ['linear'], ['line-progress'],
            0, defaultRouteStoryState.routeStyleActive.color,
            0.75, defaultRouteStoryState.routeStyleActive.color,
            1, defaultRouteStoryState.routeStyleInactive.color,
        ]);
        expect(outline.paint['line-gradient']).to.deep.equal([
            'interpolate', ['linear'], ['line-progress'],
            0, defaultRouteStoryState.routeStyleActive.outlineColor,
            0.75, defaultRouteStoryState.routeStyleActive.outlineColor,
            1, defaultRouteStoryState.routeStyleInactive.outlineColor,
        ]);
    });

    it("leaves the inactive parts without a gradient", () => {
        const inactiveParts = getRouteLineLayers(gradientState).filter((layer) =>
            layer.id === routeLayerIds.lineInactive || layer.id === routeLayerIds.lineInactiveOutline);

        for (const layer of inactiveParts) {
            expect(layer.paint['line-gradient']).to.not.exist;
        }
    });

    it("skips the gradient when the active line is dashed or the value is zero", () => {
        const dashed = activeParts({ ...gradientState, routeStyleActive: { ...gradientState.routeStyleActive, variant: 'dashed' as const } });
        const zero = activeParts({ ...gradientState, routeStyleActive: { ...gradientState.routeStyleActive, colorTransitionLengthPixels: 0 } });

        for (const layer of [...dashed, ...zero]) {
            expect(layer.paint['line-gradient']).to.not.exist;
        }
    });
});

describe("getColorTransitionLengthPercent", () => {
    const source: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: { status: 'before' },
            geometry: { type: 'LineString', coordinates: [[0, 0], [1, 0]] },
        }],
    };

    it("keeps the trail length stable as zoom changes", () => {
        const zoomTenPercent = getColorTransitionLengthPercent(source, 10, 80);
        const zoomElevenPercent = getColorTransitionLengthPercent(source, 11, 80);

        expect(zoomElevenPercent).to.be.closeTo(zoomTenPercent / 2, 0.000001);
    });
});

describe("Current point layer", () => {
    it("uses one SDF symbol layer", () => {
        const [layer] = getCurrentPointLayers({
            ...defaultRouteStoryState,
            currentPoint: {
                fillColor: 'red',
                size: 1.5,
                icon: 'AeroplaneTop01',
                autoRotate: false,
                rotation: 25,
                rotationAlignment: 'viewport',
            },
        });

        expect(layer).to.deep.equal({
            id: routeLayerIds.currentPoint,
            type: 'symbol',
            source: 'route-story-current-point',
            layout: {
                'icon-image': 'route-current-point-AeroplaneTop01',
                'icon-size': 1.5,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
                'icon-rotation-alignment': 'viewport',
                'icon-rotate': 25,
            },
            paint: {
                'icon-color': 'red',
            },
        });
    });
});
