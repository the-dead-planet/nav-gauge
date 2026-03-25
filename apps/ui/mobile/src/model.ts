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
    scrollEnabled$: BehaviorSubject<boolean>
    onPressHandlers$: BehaviorSubject<Map<string, (feature: PressEventFeature) => Promise<void>>>
    onLongPressHandlers$: BehaviorSubject<Map<string, (feature: PressEventFeature) => Promise<void>>>
    onTouchMoveHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent) => Promise<void>>>
}
