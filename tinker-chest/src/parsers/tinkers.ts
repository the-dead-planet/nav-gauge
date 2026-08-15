import { LngLat } from "../data";
import { FeatureProperties, KnownErrorCauses } from "./model";

export const getMissingGeometryError = () => ({
    cause: KnownErrorCauses.InvalidGeometry,
    message: `Invalid geometry. Upload a file with route track points.`
});

export const getUnsupportedGeometryError = (unsupportedGeometry: string) => ({
    cause: KnownErrorCauses.UnsupportedGeometry,
    message: `${unsupportedGeometry} geometry is not supported. Upload a file with a LineString geometry or Point features.`
});

export const getMissingTimeInformationError = () => ({
    cause: KnownErrorCauses.MissingTimeInformation,
    message: 'File does not contain time information.'
});

export const createFeature = (
    position: GeoJSON.Position,
    properties: FeatureProperties
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties> => ({
    type: 'Feature',
    id: properties.id,
    geometry: {
        type: 'Point',
        coordinates: position,
    },
    properties
});
interface ExifLngLat {
    GPSLongitude?: number | [number, number, number];
    GPSLongitudeRef?: string | 'E' | 'W';
    GPSLatitude?: number | [number, number, number];
    GPSLatitudeRef?: string | 'N' | 'S';
}

export const getExifLngLat = (exif?: ExifLngLat): LngLat | undefined => {
    if (!exif) {
        return;
    }

    const { GPSLongitude, GPSLongitudeRef, GPSLatitude, GPSLatitudeRef } = exif;
    if (
        GPSLongitude === undefined ||
        GPSLongitudeRef === undefined ||
        GPSLatitude === undefined ||
        GPSLatitudeRef === undefined ||
        (Array.isArray(GPSLongitude) && Array.isArray(GPSLatitude) && GPSLongitude.concat(GPSLatitude).some(isNaN))
    ) {
        return;
    }

    if (typeof GPSLongitude === 'number' && typeof GPSLatitude === 'number') {
        return {
            lng: GPSLongitude * (GPSLongitudeRef === 'W' ? -1 : 1),
            lat: GPSLatitude * (GPSLatitudeRef === 'S' ? -1 : 1)
        };
    }

    if (Array.isArray(GPSLongitude) && Array.isArray(GPSLatitude)) {
        return {
            lng: getLngLatValue(GPSLongitude, GPSLongitudeRef),
            lat: getLngLatValue(GPSLatitude, GPSLatitudeRef)
        };
    }
};

const getLngLatValue = ([deg, min, s]: [number, number, number], ref: string | 'N' | 'S' | 'W' | 'E') => {
    return (deg + min / 60 + s / 3600) * (ref === 'S' || ref === 'W' ? -1 : 1);
};

export const getExifError = (exif?: ExifLngLat | false | null): string => {
    if (!exif) {
        return 'Not valid EXIF data';
    }
    if ([exif.GPSLongitude, exif.GPSLongitudeRef, exif.GPSLatitude, exif.GPSLatitudeRef].some((el) => el === undefined)) {
        return 'No GPS coordinates in EXIF';
    }
    if ([exif.GPSLongitudeRef, exif.GPSLatitudeRef].some((el) => !['N', 'S', 'W', 'E'].includes(el as string))) {
        return 'Unprocessable GPS data in EXIF';
    }
    if (
        (Array.isArray(exif.GPSLongitude) && exif.GPSLongitude?.some((el) => isNaN(el))) ||
        (Array.isArray(exif.GPSLatitude) && exif.GPSLatitude?.some((el) => isNaN(el)))
    ) {
        return 'Unprocessable GPS data in EXIF';
    }
    if (
        (typeof exif.GPSLongitude === 'number' && isNaN(exif.GPSLongitude)) ||
        (typeof exif.GPSLatitude === 'number' && isNaN(exif.GPSLatitude))
    ) {
        return 'Unprocessable GPS data in EXIF';
    }
    return "";
};