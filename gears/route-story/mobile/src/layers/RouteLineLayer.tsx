import { FC } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import {
    getAnimatedRouteLineLayers,
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
        {getAnimatedRouteLineLayers(state, routeDistanceFraction ?? 0).map(renderLayerSpec)}
        {getRoutePointsLayers(state).map(renderLayerSpec)}
    </GeoJSONSource>
);
