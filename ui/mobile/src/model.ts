import { GestureResponderEvent, ViewStyle } from "react-native";
import { BehaviorSubject } from "rxjs";
import { CameraRef, MapRef, PressEvent, PressEventWithFeatures } from "@maplibre/maplibre-react-native";

export interface PressFeatureProperties {
    screenPointX?: number;
    screenPointY?: number;
}

export type PressEventFeature = GeoJSON.Feature<GeoJSON.Point, PressFeatureProperties>;

export type MutableViewStyle = { -readonly [K in keyof ViewStyle]: ViewStyle[K] };
