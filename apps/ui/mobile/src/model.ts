import { CameraRef, MapViewRef, UserLocationRef } from "@maplibre/maplibre-react-native";
import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";

export interface PressFeatureProperties {
    screenPointX?: number;
    screenPointY?: number;
}

export type PressEventFeature = GeoJSON.Feature<GeoJSON.Point, PressFeatureProperties>;

export interface MobileMap {
    map: React.RefObject<MapViewRef | null>;
    camera: React.RefObject<CameraRef | null>;
    userLocation: React.RefObject<UserLocationRef | null>;
    width: number;
    height: number;
    onPressHandlers$: BehaviorSubject<Map<string, (feature: PressEventFeature) => void>>
    onLongPressHandlers$: BehaviorSubject<Map<string, (feature: PressEventFeature) => void>>
    onTouchMoveHandlers$: BehaviorSubject<Map<string, (event: GestureResponderEvent) => void>>
}
