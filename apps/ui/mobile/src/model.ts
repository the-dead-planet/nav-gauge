import { CameraRef, MapViewRef } from "@maplibre/maplibre-react-native";

export interface MobileMap {
    map: MapViewRef | null;
    camera: CameraRef | null;
}
