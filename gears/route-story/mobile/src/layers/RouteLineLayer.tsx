import { FC } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import {
    getRouteLineLayers,
    getProgressRouteLineLayers,
    getProgressRoutePointsLayers,
    getRoutePointsLayers,
    RouteStoryState,
    routeSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
    routeDistanceFraction?: number;
}

export const RouteLineLayer: FC<Props> = ({ source, state, routeDistanceFraction }) => (
    <GeoJSONSource
        id={routeSourceIds.line}
        data={source}
        lineMetrics={routeDistanceFraction !== undefined}
    >
        {(routeDistanceFraction === undefined
            ? getRouteLineLayers(state)
            : getProgressRouteLineLayers(state, routeDistanceFraction)).map(renderLayerSpec)}
        {(routeDistanceFraction === undefined
            ? getRoutePointsLayers(state)
            : getProgressRoutePointsLayers(state, routeDistanceFraction)).map(renderLayerSpec)}
    </GeoJSONSource>
);
