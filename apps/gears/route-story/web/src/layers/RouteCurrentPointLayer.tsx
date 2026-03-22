import { FC, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-ui";
import { routeSourceIds, layerOrder } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { currentPointLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
}

export const RouteCurrentPointLayer: FC<Props> = ({
    map,
    source,
}) => {
    const mapLayerData = useMemo((): MapLayerData => ({
        sourceId: routeSourceIds.currentPoint,
        source: {
            type: 'geojson',
            data: source,
        },
        layers: currentPointLayers,
    }), [source]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
