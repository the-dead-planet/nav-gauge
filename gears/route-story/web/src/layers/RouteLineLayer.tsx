import { FC, useEffect, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { defaultRouteStoryState, getProgressRouteLineLayers, getProgressRoutePointsLayers, getRouteLineLayers, getRoutePointsLayers, layerOrder, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { setRouteDistanceFraction, updateRouteLayerStyle } from "../tinkers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
    routeDistanceFraction?: number;
    createSplitLineGeometry: boolean;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    source,
    state,
    routeDistanceFraction,
    createSplitLineGeometry,
}) => {
    const [mapLayerData] = useState((): MapLayerData => {
        const routeLayers: MapLayerData['layers'] = [];
        const initialState = createSplitLineGeometry ? defaultRouteStoryState : {
            ...defaultRouteStoryState,
            routeStyleActive: { ...defaultRouteStoryState.routeStyleActive, variant: 'solid' as const },
            routeStyleInactive: { ...defaultRouteStoryState.routeStyleInactive, variant: 'solid' as const },
        };

        routeLayers.push(...createSplitLineGeometry
            ? getRouteLineLayers(initialState)
            : getProgressRouteLineLayers(initialState, 0));
        routeLayers.push(...createSplitLineGeometry
            ? getRoutePointsLayers(initialState)
            : getProgressRoutePointsLayers(initialState, 0));

        return {
            sourceId: routeSourceIds.line,
            source: {
                type: 'geojson',
                data: source,
                promoteId: 'id',
                lineMetrics: !createSplitLineGeometry,
            },
            layers: routeLayers,
        };
    });
    const updatedData = useMemo(() => ({ sourceId: routeSourceIds.line, data: source }), [source]);

    useEffect(() => {
        setRouteDistanceFraction(map, routeDistanceFraction ?? 0);
    }, [map, source, routeDistanceFraction]);

    useEffect(() => {
        updateRouteLayerStyle(map, state, routeDistanceFraction ?? 0, createSplitLineGeometry);
    }, [map, state, routeDistanceFraction, createSplitLineGeometry]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            updatedData={updatedData}
            layerOrder={layerOrder}
        />
    );
};
