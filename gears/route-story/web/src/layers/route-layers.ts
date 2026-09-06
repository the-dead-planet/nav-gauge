import * as maplibregl from "maplibre-gl";
import {
    getCameraLineLayers,
    getCurrentPointLayers,
    getRouteLineLayers,
    getRoutePointsLayers,
    RouteStoryState,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const getWebRouteLineLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getRouteLineLayers(state) as unknown as maplibregl.LayerSpecification[];

export const getWebRoutePointsLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getRoutePointsLayers(state) as unknown as maplibregl.LayerSpecification[];

export const getWebCurrentPointLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getCurrentPointLayers(state) as unknown as maplibregl.LayerSpecification[];

export const cameraLineLayers = getCameraLineLayers() as unknown as maplibregl.LayerSpecification[];