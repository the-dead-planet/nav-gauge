import { MobileChronoLens, MobileMap } from "@mobile-apparatus";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { MobileMarkerImageData } from "./images/image-parser";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export type MobilePlayerOperator = PlayerOperator<MobileMap, MobileChronoLens, DocumentPickerResponse, MobileMarkerImageData>;
export type MobileRouteStoryProps = RouteStoryProps<MobileMap, MobileChronoLens, DocumentPickerResponse, MobileMarkerImageData>;
