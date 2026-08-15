import { FC, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { routeSourceIds, layerOrder, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { routeLineLayers, routePointsLayer } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({
    map,
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
            sourceId: routeSourceIds.line,
            source: {
                type: 'geojson',
                data: source,
                promoteId: 'id'
            },
            layers: routeLayers,
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
