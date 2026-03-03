import { CameraRef, MapViewRef, UserLocationRef } from "@maplibre/maplibre-react-native";

export interface MobileMap {
    map: React.RefObject<MapViewRef | null>;
    camera: React.RefObject<CameraRef | null>;
    userLocation: React.RefObject<UserLocationRef | null>;
    width: number;
    height: number;
}
