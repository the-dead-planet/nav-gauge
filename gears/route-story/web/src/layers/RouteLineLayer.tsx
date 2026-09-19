import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineLayers, getRoutePointsLayers, layerOrder, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
    routeDistanceFraction?: number;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    source,
    state,
    routeDistanceFraction,
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        const routeLayers: MapLayerData['layers'] = [];

        if (state.routeStyleActive.showRouteLine || state.routeStyleInactive.showRouteLine) {
            routeLayers.push(...routeDistanceFraction === undefined ? getRouteLineLayers(state) : getProgressRouteLineLayers(state, routeDistanceFraction));
        }
        if (state.routeStyleActive.showRoutePoints || state.routeStyleInactive.showRoutePoints) {
            routeLayers.push(...routeDistanceFraction === undefined
                ? getRoutePointsLayers(state)
                : getProgressRoutePointsLayers(state, routeDistanceFraction));
        }

        return {
            sourceId: routeSourceIds.line,
            source: {
                type: 'geojson',
                data: source,
                promoteId: 'id',
                lineMetrics: routeDistanceFraction !== undefined,
            },
            layers: routeLayers,
        };
    }, [source, state]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
