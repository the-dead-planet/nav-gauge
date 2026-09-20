import * as maplibregl from "maplibre-gl";
import { getColorTransitionLengthPercent, getRouteLineLayers, getRoutePointsLayers, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    map: maplibregl.Map,
    line: GeoJSON.GeoJSON,
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
    state: RouteStoryState,
): void => {
    map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.line)?.setData(line);
    map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.currentPoint)?.setData(currentPoint);
    updateRouteLineGradient(map, state, line);
};

/**
 * Applies popup style changes to already-installed layers without re-adding them.
 */
export const updateRouteLayerStyle = (
    map: maplibregl.Map,
    state: RouteStoryState,
): void => {
    const layers = [...getRouteLineLayers(state), ...getRoutePointsLayers(state)];

    for (const layer of layers) {
        if (!map.getLayer(layer.id)) {
            continue;
        }
        map.setFilter(layer.id, layer.filter as maplibregl.FilterSpecification | null);
        for (const [property, value] of Object.entries(layer.layout)) {
            map.setLayoutProperty(layer.id, property as keyof maplibregl.AllLayoutProperties, value);
        }
        const paint = layer.type === 'line'
            ? { 'line-dasharray': null, 'line-gradient': null, ...layer.paint }
            : layer.paint;
        for (const [property, value] of Object.entries(paint)) {
            map.setPaintProperty(layer.id, property as keyof maplibregl.AllPaintProperties, value);
        }
    }
};

export const updateRouteLineGradient = (
    map: maplibregl.Map,
    state: RouteStoryState,
    source: GeoJSON.GeoJSON,
): void => {
    const transitionLengthPercent = getColorTransitionLengthPercent(
        source,
        map.getZoom(),
        state.routeStyleActive.colorTransitionLengthPixels,
    );
    const layers = getRouteLineLayers(state, transitionLengthPercent).filter((layer) =>
        layer.id === routeLayerIds.lineActive || layer.id === routeLayerIds.lineActiveOutline);

    for (const layer of layers) {
        map.setPaintProperty(layer.id, 'line-gradient', (layer.paint['line-gradient'] ?? null) as unknown as maplibregl.ExpressionSpecification);
    }
};
