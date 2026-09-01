import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { layerOrder, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { routeLineLayers, routePointsLayer } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    sourceId: string;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    sourceId,
    source,
    state: { showRouteLine, showRoutePoints },
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        const routeLayers: MapLayerData['layers'] = [];

        if (showRouteLine) {
            routeLayers.push(...routeLineLayers);
        }
        if (showRoutePoints) {
            routeLayers.push(routePointsLayer);
        }

        return {
            sourceId,
            source: {
                type: 'geojson',
                data: source,
                promoteId: 'id'
            },
            layers: sourceId === routeSourceIds.simplifiedLine ? [
                {
                    id: routeLayerIds.line + 'simplified',
                    type: 'line',
                    source: sourceId,
                    layout: {},
                    paint: {
                        "line-width": 4,
                        "line-color": 'green'
                    },
                },
                {
                    id: routeLayerIds.points + 'simplified',
                    type: 'circle',
                    source: sourceId,
                    layout: {},
                    paint: {
                        "circle-radius": 7,
                        "circle-color": 'green'
                    },
                },
            ] : routeLayers,
        };
    }, [source, showRouteLine, showRoutePoints]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
