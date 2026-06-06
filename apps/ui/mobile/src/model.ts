import { CameraRef, MapRef, PressEvent, PressEventWithFeatures } from "@maplibre/maplibre-react-native";
import { RefObject } from "react";
import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";

export interface PressFeatureProperties {
    screenPointX?: number;
    screenPointY?: number;
}

export type PressEventFeature = GeoJSON.Feature<GeoJSON.Point, PressFeatureProperties>;

export interface MobileMap {
    map: RefObject<MapRef | null>;
    camera: RefObject<CameraRef | null>;
    width: number;
    height: number;
    dragPan$: BehaviorSubject<boolean>
    onPressHandlers$: BehaviorSubject<Map<string, (event: PressEvent | PressEventWithFeatures) => Promise<void>>>
    onLongPressHandlers$: BehaviorSubject<Map<string, (event: PressEvent) => Promise<void>>>
    onPanResponderStartHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent) => Promise<void>>>
    onPanResponderMoveHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent) => Promise<void>>>
    onPanResponderEndHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent) => Promise<void>>>
}
