import * as maplibregl from "maplibre-gl";
import { getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineGradient, getRouteLineLayers, getRoutePointsLayers, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

const routeDistanceFractions = new WeakMap<maplibregl.Map, number>();

export const setRouteDistanceFraction = (map: maplibregl.Map, routeDistanceFraction: number): void => {
    routeDistanceFractions.set(map, routeDistanceFraction);
};

export const updateRouteLayerStyle = (
    map: maplibregl.Map,
    state: RouteStoryState,
    routeDistanceFraction: number,
    createSplitLineGeometry: boolean,
): void => {
    routeDistanceFraction = routeDistanceFractions.get(map) ?? routeDistanceFraction;
    const layers = createSplitLineGeometry
        ? [...getRouteLineLayers(state), ...getRoutePointsLayers(state)]
        : [...getProgressRouteLineLayers(state, routeDistanceFraction), ...getProgressRoutePointsLayers(state, routeDistanceFraction)];

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

export const updateRouteLayer = (
    {
        map,
        currentPoint,
        line,
        routeDistanceFraction,
        createSplitLineGeometry,
        state,
    }: {
        map: maplibregl.Map;
        currentPoint: GeoJSON.Feature<GeoJSON.Point>;
        line: GeoJSON.GeoJSON;
        routeDistanceFraction: number;
        createSplitLineGeometry: boolean;
        state: RouteStoryState;
    },
): void => {
    setRouteDistanceFraction(map, routeDistanceFraction);
    map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.currentPoint)?.setData(currentPoint);
    if (createSplitLineGeometry) {
        map.getSource<maplibregl.GeoJSONSource>(routeSourceIds.line)?.setData(line);
        return;
    }

    const layers: Array<[string, 'before' | 'after', string, string]> = [
        [routeLayerIds.lineActiveOutline, 'before', state.routeStyleActive.outlineColor, state.routeStyleInactive.outlineColor],
        [routeLayerIds.lineActive, 'before', state.routeStyleActive.color, state.routeStyleInactive.color],
        [routeLayerIds.lineInactiveOutline, 'after', state.routeStyleActive.outlineColor, state.routeStyleInactive.outlineColor],
        [routeLayerIds.lineInactive, 'after', state.routeStyleActive.color, state.routeStyleInactive.color],
    ];
    for (const [layerId, status, activeColor, inactiveColor] of layers) {
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'line-gradient', getRouteLineGradient(
                status,
                activeColor,
                inactiveColor,
                routeDistanceFraction,
                state.currentPoint.colorTransitionLengthPercent / 100,
            ) as maplibregl.ExpressionSpecification);
        }
    }
    if (map.getLayer(routeLayerIds.pointsActive)) {
        map.setFilter(routeLayerIds.pointsActive, ['<=', ['get', 'routeDistanceFraction'], routeDistanceFraction]);
    }
    if (map.getLayer(routeLayerIds.pointsInactive)) {
        map.setFilter(routeLayerIds.pointsInactive, ['>', ['get', 'routeDistanceFraction'], routeDistanceFraction]);
    }
};
