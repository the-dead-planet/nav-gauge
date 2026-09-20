import * as maplibregl from "maplibre-gl";
import { getAnimatedRouteLineLayers, getRoutePointsLayers, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

const routeDistanceFractions = new WeakMap<maplibregl.Map, number>();

interface RouteFrame {
    line: GeoJSON.GeoJSON;
    routeDistanceFraction: number;
    state: RouteStoryState;
}

interface RouteFrameUpdateState {
    processing: boolean;
    pending?: RouteFrame;
}

const routeFrameUpdates = new WeakMap<maplibregl.Map, RouteFrameUpdateState>();

export const setRouteDistanceFraction = (map: maplibregl.Map, routeDistanceFraction: number): void => {
    routeDistanceFractions.set(map, routeDistanceFraction);
};

export const updateRouteLayerStyle = (
    map: maplibregl.Map,
    state: RouteStoryState,
    routeDistanceFraction: number,
): void => {
    routeDistanceFraction = routeDistanceFractions.get(map) ?? routeDistanceFraction;
    const layers = [...getAnimatedRouteLineLayers(state, routeDistanceFraction), ...getRoutePointsLayers(state)];

    for (const layer of layers) {
        if (!map.getLayer(layer.id)) {
            continue;
        }
        map.setLayoutProperty(layer.id, 'visibility', layer.layout.visibility);
        map.setFilter(layer.id, layer.filter as maplibregl.FilterSpecification ?? null);

        if (layer.type === 'line') {
            map.setLayoutProperty(layer.id, 'line-cap', layer.layout['line-cap']);
            map.setLayoutProperty(layer.id, 'line-join', layer.layout['line-join']);
            map.setPaintProperty(layer.id, 'line-color', layer.paint['line-color']);
            map.setPaintProperty(layer.id, 'line-gradient', layer.paint['line-gradient'] as maplibregl.ExpressionSpecification | undefined);
            map.setPaintProperty(layer.id, 'line-width', layer.paint['line-width']);
            map.setPaintProperty(layer.id, 'line-opacity', layer.paint['line-opacity']);
            map.setPaintProperty(layer.id, 'line-dasharray', layer.paint['line-dasharray']);
        } else {
            map.setPaintProperty(layer.id, 'circle-color', layer.paint['circle-color'] as maplibregl.ExpressionSpecification | string);
            map.setPaintProperty(layer.id, 'circle-radius', layer.paint['circle-radius']);
        }
    }
};

const applyRouteProgress = (map: maplibregl.Map, routeDistanceFraction: number, state: RouteStoryState): void => {
    setRouteDistanceFraction(map, routeDistanceFraction);
    for (const layer of getAnimatedRouteLineLayers(state, routeDistanceFraction)) {
        const gradient = layer.paint['line-gradient'];
        if (gradient && (layer.id === routeLayerIds.lineActive || layer.id === routeLayerIds.lineActiveOutline) && map.getLayer(layer.id)) {
            map.setPaintProperty(layer.id, 'line-gradient', gradient as maplibregl.ExpressionSpecification);
        }
    }
};

const processRouteFrameUpdate = (map: maplibregl.Map, updateState: RouteFrameUpdateState): void => {
    const frame = updateState.pending;
    const source = map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.line);
    if (!frame || !source) {
        return;
    }

    updateState.pending = undefined;
    updateState.processing = true;
    const onSourceData = (event: maplibregl.MapSourceDataEvent) => {
        if (event.sourceId !== routeSourceIds.line || !event.isSourceLoaded) {
            return;
        }
        map.off('sourcedata', onSourceData);
        applyRouteProgress(map, frame.routeDistanceFraction, frame.state);
        map.once('render', () => {
            updateState.processing = false;
            processRouteFrameUpdate(map, updateState);
        });
    };
    map.on('sourcedata', onSourceData);
    source.setData(frame.line);
};

export const updateRouteLayer = (
    {
        map,
        line,
        routeDistanceFraction,
        state,
    }: {
        map: maplibregl.Map;
        line: GeoJSON.GeoJSON;
        routeDistanceFraction: number;
        state: RouteStoryState;
    },
): void => {
    const updateState = routeFrameUpdates.get(map) ?? { processing: false };
    updateState.pending = { line, routeDistanceFraction, state };
    routeFrameUpdates.set(map, updateState);
    if (!updateState.processing) {
        processRouteFrameUpdate(map, updateState);
    }
};
