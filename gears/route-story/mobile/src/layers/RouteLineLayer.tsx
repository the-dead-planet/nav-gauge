import { FC } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import {
    getRouteLineLayers,
    getColorTransitionLengthPercent,
    getRoutePointsLayers,
    RouteStoryState,
    routeSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
    zoom: number;
}

export const RouteLineLayer: FC<Props> = ({ source, state, zoom }) => (
    <GeoJSONSource
        id={routeSourceIds.line}
        data={source}
        lineMetrics
    >
        {getRouteLineLayers(state, getColorTransitionLengthPercent(source, zoom, state.routeStyleActive.colorTransitionLengthPixels)).map(renderLayerSpec)}
        {getRoutePointsLayers(state).map(renderLayerSpec)}
    </GeoJSONSource>
);
