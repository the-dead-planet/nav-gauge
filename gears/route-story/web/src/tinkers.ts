import * as maplibregl from "maplibre-gl";
import { getRouteLineGradient, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

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
