import { DateFormat, TimeFormat } from "./model";
import { DateTime } from "luxon";

/**
 * Formats milliseconds as HH:mm:ss.
 * @param epochMs Time in ms since epoch.
 * @example 13583000 will be formatted as `03:46:23`
 */
export const formatTimeMsAsStandard = (epochMs: number): string => {
    return DateTime.fromMillis(epochMs, { zone: 'UTC' }).toFormat("HH:mm:ss");
};

/**
 * Formats time since epoch in milliseconds to a user friendly format.
 * @returns Formatted value, for example `Thu 31.07.2025 10:00:00`
 */
export const formatTimestamp = (epochMs: number, options: {
    zone?: string;
    dateFormat: DateFormat;
    timeFormat: TimeFormat
}): string => {
    const { zone, dateFormat, timeFormat } = options ?? {};
    return DateTime.fromMillis(epochMs, { zone }).toFormat(`${dateFormat} ${timeFormat}`);
};
