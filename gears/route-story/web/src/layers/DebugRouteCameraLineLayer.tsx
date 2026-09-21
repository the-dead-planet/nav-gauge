import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { layerOrder, routeSourceIds, RouteGeometryData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { cameraLineLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    routeGeometryData: RouteGeometryData;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({
    map,
    routeGeometryData,
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sourceId: routeSourceIds.cameraLine,
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [routeGeometryData.spline]
                },
                promoteId: 'id'
            },
            layers: cameraLineLayers,
        };
    }, [routeGeometryData]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
