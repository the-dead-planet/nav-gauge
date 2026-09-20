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
        map.setLayoutProperty(layer.id, 'visibility', layer.layout.visibility);
        map.setFilter(layer.id, layer.filter as maplibregl.FilterSpecification | null);

        if (layer.type === 'line') {
            map.setLayoutProperty(layer.id, 'line-cap', layer.layout['line-cap']);
            map.setLayoutProperty(layer.id, 'line-join', layer.layout['line-join']);
            map.setPaintProperty(layer.id, 'line-color', layer.paint['line-color']);
            map.setPaintProperty(layer.id, 'line-width', layer.paint['line-width']);
            map.setPaintProperty(layer.id, 'line-opacity', layer.paint['line-opacity']);
            map.setPaintProperty(layer.id, 'line-dasharray', (layer.paint['line-dasharray'] ?? null) as maplibregl.DataDrivenPropertyValueSpecification<number[]>);
            map.setPaintProperty(layer.id, 'line-gradient', (layer.paint['line-gradient'] ?? null) as unknown as maplibregl.ExpressionSpecification);
        } else {
            map.setPaintProperty(layer.id, 'circle-color', layer.paint['circle-color']);
            map.setPaintProperty(layer.id, 'circle-radius', layer.paint['circle-radius']);
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
