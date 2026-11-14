import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";
import { CameraRef, MapRef, PressEvent, PressEventWithFeatures } from "@maplibre/maplibre-react-native";

export interface MobileMap {
    map$: BehaviorSubject<MapRef | null>;
    camera$: BehaviorSubject<CameraRef | null>;
    mapSize$: BehaviorSubject<{ width: number; height: number; }>,
    dragPan$: BehaviorSubject<boolean>
    cameraMoving$: BehaviorSubject<boolean>;
    /** Screen-space correction while dragging an offset map object. */
    panResponderOffset: [number, number];
    onPressHandlers$: BehaviorSubject<Map<string, (event: PressEvent | PressEventWithFeatures) => Promise<void>>>
    onLongPressHandlers$: BehaviorSubject<Map<string, (event: PressEvent) => Promise<void>>>
    onPanResponderStartHandlers$: BehaviorSubject<Map<string, (event: GestureResponderEvent) => Promise<void>>>
    onPanResponderShouldStartHandlers$: BehaviorSubject<Map<string, (event: GestureResponderEvent) => boolean>>
    onPanResponderMoveHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent) => Promise<void>>>
    onPanResponderEndHandlers$: BehaviorSubject<Map<string, (lngLat: number[], event: GestureResponderEvent, cancelled?: boolean) => Promise<void>>>
}
