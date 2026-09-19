import * as maplibregl from "maplibre-gl";
import {
    getCameraLineLayers,
    getCurrentPointLayers,
    getProgressRouteLineLayers,
    getProgressRoutePointsLayers,
    getRoutePointsLayers,
    RouteStoryState,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const getWebRouteLineLayers = (state: RouteStoryState, routeDistanceFraction: number): maplibregl.LayerSpecification[] =>
    getProgressRouteLineLayers(state, routeDistanceFraction) as maplibregl.LineLayerSpecification[];

export const getWebRoutePointsLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getRoutePointsLayers(state);

export const getWebProgressRoutePointsLayers = (state: RouteStoryState, routeDistanceFraction: number): maplibregl.LayerSpecification[] =>
    getProgressRoutePointsLayers(state, routeDistanceFraction) as maplibregl.CircleLayerSpecification[];

export const getWebCurrentPointLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getCurrentPointLayers(state);

export const cameraLineLayers = getCameraLineLayers();
