import { FC, useEffect, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { defaultRouteStoryState, getCurrentPointImageName, getCurrentPointLayers, layerOrder, routeLayerIds, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
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
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            if (!map.hasImage(imageName)) {
                map.addImage(imageName, image, { pixelRatio: Math.max(image.width, image.height) / 20, sdf: true });
            }
            if (map.getLayer(routeLayerIds.currentPoint)) {
                map.setLayoutProperty(routeLayerIds.currentPoint, 'icon-image', imageName);
            }
            setImageLoaded(true);
        };
        image.src = imageSource;

        return () => {
            image.onload = null;
        };
    }, [imageName, imageSource, map]);

    const mapLayerData = useMemo((): MapLayerData => ({
        sourceId: routeSourceIds.currentPoint,
        source: {
            type: 'geojson',
            data: source,
        },
        layers: imageLoaded ? getCurrentPointLayers(defaultRouteStoryState) : [],
    }), [imageLoaded, source]);
    const updatedData = useMemo(() => ({ sourceId: routeSourceIds.currentPoint, data: source }), [source]);

    useEffect(() => {
        const [layer] = getCurrentPointLayers(state);
        if (!map.getLayer(layer.id)) {
            return;
        }
        map.setLayoutProperty(layer.id, 'icon-image', layer.layout['icon-image']);
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