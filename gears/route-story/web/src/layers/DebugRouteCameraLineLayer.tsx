import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers } from "@web-apparatus";
import { layerOrder, routeSourceIds, SplineData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { cameraLineLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    spline: SplineData;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({
    map,
    spline,
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sourceId: routeSourceIds.cameraLine,
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [spline.spline]
                },
                promoteId: 'id'
            },
            layers: cameraLineLayers,
        };
    }, [spline]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
