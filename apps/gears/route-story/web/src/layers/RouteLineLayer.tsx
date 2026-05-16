import { FC, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { routeSourceIds, layerOrder } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { routeLineLayer, routePointsLayer } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    source,
}) => {
    const { cartomancer } = useMachineWard();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { showRouteLine, showRoutePoints } = gaugeControls;

    const mapLayerData = useMemo((): MapLayerData => {
        const routeLayers: MapLayerData['layers'] = [];

        if (showRouteLine) {
            routeLayers.push(routeLineLayer);
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
