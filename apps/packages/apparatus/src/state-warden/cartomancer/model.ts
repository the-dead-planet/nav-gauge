import { ComponentType } from "react";

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
    controlPosition: maplibregl.ControlPosition;
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

export interface OverlayComponentProps {
    map: maplibregl.Map;
}

export interface ExifData {
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTime?: string;
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTimeOriginal?: string;
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTimeDigitized?: string;
    /**
     * @example YYYY:MM:DD local
     */
    GPSDateStamp?: string;
    GPSDestBearing?: { denominator: number; numerator: number };
    GPSDestBearingRef?: string;
    GPSLongitude?: [number, number, number];
    GPSLongitudeRef?: 'E' | 'W';
    GPSLatitude?: [number, number, number];
    GPSLatitudeRef?: 'N' | 'S';
}

export interface MarkerImage {
    id: number;
    name: string;
    progress: number;
    lngLat?: maplibregl.LngLat;
    data?: string;
    exif?: ExifData;
    error?: string;
    featureId?: number;
    marker?: maplibregl.Marker;
}
