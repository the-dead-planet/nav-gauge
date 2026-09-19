import { FC, useEffect, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { defaultRouteStoryState, getCurrentPointImageName, getCurrentPointLayers, routeLayerIds, routeSourceIds, layerOrder, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({
    map,
    source,
    state,
}) => {
    const imageName = getCurrentPointImageName(state.currentPoint.icon);
    const imageSource = state.currentPoint.icon === 'Circle'
        ? Icons.Circle
        : Icons.NounProject[state.currentPoint.icon];

    useEffect(() => {
        if (map.hasImage(imageName)) {
            map.setLayoutProperty(routeLayerIds.currentPoint, 'icon-image', imageName);
            return;
        }

        const image = new Image();
        image.onload = () => {
            map.addImage(imageName, image, { pixelRatio: Math.max(image.width, image.height) / 20, sdf: true });
            if (map.getLayer(routeLayerIds.currentPoint)) {
                map.setLayoutProperty(routeLayerIds.currentPoint, 'icon-image', imageName);
            }
        };
        image.src = imageSource;

        return () => {
            image.onload = null;
        };
    }, [imageName, imageSource, map]);

    const [mapLayerData] = useState((): MapLayerData => ({
        sourceId: routeSourceIds.currentPoint,
        source: {
            type: 'geojson',
            data: source,
        },
        layers: getCurrentPointLayers(defaultRouteStoryState),
    }));
    const updatedData = useMemo(() => ({ sourceId: routeSourceIds.currentPoint, data: source }), [source]);

    useEffect(() => {
        const [layer] = getCurrentPointLayers(state);
        if (!map.getLayer(layer.id)) {
            return;
        }
        map.setPaintProperty(layer.id, 'icon-color', layer.paint['icon-color']);
        map.setLayoutProperty(layer.id, 'icon-size', layer.layout['icon-size']);
        map.setLayoutProperty(layer.id, 'icon-rotation-alignment', layer.layout['icon-rotation-alignment']);
        map.setLayoutProperty(layer.id, 'icon-rotate', layer.layout['icon-rotate']);
    }, [map, state]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            updatedData={updatedData}
            layerOrder={layerOrder}
        />
    );
};
