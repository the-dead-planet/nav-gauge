import { CameraRef, MapViewRef, UserLocationRef } from "@maplibre/maplibre-react-native";

export interface MobileMap {
    map: MapViewRef | null;
    camera: CameraRef | null;
    userLocation: UserLocationRef | null;
}
