import { DistanceUnit } from "./model";

export const formatDistance = (meters: number, distanceUnit: DistanceUnit, locale: string): string => {
    const value = distanceUnit === 'metric' ? meters / 1000 : meters / 1609.344;
    const unit = distanceUnit === 'metric' ? 'km' : 'mi';

    return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} ${unit}`;
};
