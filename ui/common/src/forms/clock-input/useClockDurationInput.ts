import { ClockDurationInputProps } from "./model";
import {
    durationPartsToMilliseconds,
    millisecondsToDurationParts,
} from "./math";

export const useClockDurationInput = ({
    value,
    min = 0,
    onChange,
}: Pick<ClockDurationInputProps, "value" | "min" | "onChange">) => {
    const { minutes, seconds } = millisecondsToDurationParts(value);
    const changeDuration = (nextMinutes: number, nextSeconds: number) => {
        onChange?.(
            Math.max(
                min,
                durationPartsToMilliseconds({
                    minutes: nextMinutes,
                    seconds: nextSeconds,
                }),
            ),
        );
    };

    return {
        minutes,
        seconds,
        onMinutesChange: (nextMinutes: number) =>
            changeDuration(nextMinutes, seconds),
        onSecondsChange: (nextSeconds: number) =>
            changeDuration(minutes, nextSeconds),
    };
};
