import { FC, useEffect, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { defaultRouteStoryState, getRouteLineLayers, getRoutePointsLayers, layerOrder, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayerStyle, updateRouteLineGradient } from "../tinkers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    source,
    state,
}) => {
    const [mapLayerData] = useState((): MapLayerData => ({
        sourceId: routeSourceIds.line,
        source: {
            type: 'geojson',
            data: source,
            promoteId: 'id',
            lineMetrics: true,
        },
        layers: [
            ...getRouteLineLayers(defaultRouteStoryState),
            ...getRoutePointsLayers(defaultRouteStoryState),
        ],
    }));
    const updatedData = useMemo(() => ({ sourceId: routeSourceIds.line, data: source }), [source]);

    useEffect(() => {
        updateRouteLayerStyle(map, state);
        updateRouteLineGradient(map, state, source);
    }, [map, source, state]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            updatedData={updatedData}
            layerOrder={layerOrder}
        />
    );
};
