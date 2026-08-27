import type * as maplibregl from "maplibre-gl";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { WebChronoLens } from "@web-apparatus";
import { WebMarkerImageData } from "./images/image-parser";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export type WebPlayerOperator = PlayerOperator<maplibregl.Map, WebChronoLens, File, WebMarkerImageData>;
export type WebRouteStoryProps = RouteStoryProps<maplibregl.Map, WebChronoLens, File, WebMarkerImageData>;
