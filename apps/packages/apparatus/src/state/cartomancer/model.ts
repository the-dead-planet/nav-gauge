import { ComponentType, Dispatch, SetStateAction } from "react";
import { RouteTimes } from "@tinker-chest";
import { GeoJson } from "../../parsers";

export interface Overlay {
    id: string;
    component: ComponentType<OverlayComponentProps>;
}

export interface OverlayComponentProps {
    map: maplibregl.Map;
    geojson: GeoJson;
    images: MarkerImage[];
    routeTimes: RouteTimes;
    progressMs: number;
    onProgressMsChange: Dispatch<SetStateAction<number>>;
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
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
