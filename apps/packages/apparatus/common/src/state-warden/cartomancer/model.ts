import { LngLat } from "@tinker-chest";
import { ExifData } from "../../parsers";

export interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GaugeControlsType {
    globeProjection: boolean;
    showZoomButtons: boolean;
    showCurrentZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    controlPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    controlPlacement: ControlPlacement;
    // TODO: Belongs to route gear
    showRouteLine: boolean;
    showRoutePoints: boolean;
}

export interface MapLayout {
    size: MapLayoutSize;
    borderWidth: number;
    borderColor: string;
    innerBorderWidth: number;
    innerBorderColor: string;
    borderRadius: string;
    boxShadow: string;
    innerBoxShadow: string;
};

export interface MapLayoutSize {
    type: 'manual' | 'full-screen',
    width: number;
    height: number;
}

export interface OverlayComponentProps<TMap> {
    map: TMap;
}

export interface MarkerImage<TImageData> {
    id: number;
    name: string;
    progress: number;
    lngLat?: LngLat;
    data?: TImageData;
    exif?: ExifData;
    error?: string;
    featureId?: number;
}

export interface LoadedImageData<TImageData> extends Omit<MarkerImage<TImageData>, 'progress' | 'error' | 'featureId' | 'data' | 'lngLat'> {
    lngLat: LngLat;
    featureId: number;
    data: TImageData;
}
