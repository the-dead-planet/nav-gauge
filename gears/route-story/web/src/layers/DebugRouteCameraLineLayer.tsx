import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { getSplineData, layerOrder, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { GeoJson } from "@tinker-chest";
import { cameraLineLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    geojson: GeoJson;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({
    map,
    geojson,
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sourceId: routeSourceIds.cameraLine,
            source: {
                type: 'geojson',
                data: {
                    ...geojson,
                    features: [getSplineData(geojson).spline]
                },
                promoteId: 'id'
            },
            layers: cameraLineLayers,
        };
    }, [geojson]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
