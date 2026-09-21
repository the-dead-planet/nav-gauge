import { DateTime } from "luxon";
import { DateFormat, TimeFormat } from "./model";

export const formatTimeMsAsStandard = (epochMs: number): string =>
    DateTime.fromMillis(epochMs, { zone: 'UTC' }).toFormat('HH:mm:ss');

export const formatTimestamp = (epochMs: number, options: {
    zone?: string;
    locale?: string;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}): string => {
    const { zone, locale, dateFormat, timeFormat } = options;

    return DateTime.fromMillis(epochMs, { zone, locale }).toFormat(`${dateFormat} ${timeFormat}`);
};
