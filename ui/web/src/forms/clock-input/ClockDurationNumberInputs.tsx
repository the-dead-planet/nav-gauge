import { FC } from "react";
import { ClockDurationNumberInputsProps, useClockDurationInput } from "@ui";
import { NumberInput } from "../number-input";
import styles from "./clock-input.module.css";

export const ClockDurationNumberInputs: FC<ClockDurationNumberInputsProps> = ({
    value,
    min,
    onChange,
    ariaLabel = "Duration",
    ...appearanceProps
}) => {
    const { minutes, seconds, onMinutesChange, onSecondsChange } =
        useClockDurationInput({ value, min, onChange });
    const disabled = appearanceProps.disabled || !onChange;

    return (
        <div className={styles["duration-number-inputs"]}>
            <NumberInput
                {...appearanceProps}
                value={minutes}
                className={styles["number-input"]}
                onChange={onMinutesChange}
                min={0}
                step={1}
                disabled={disabled}
                showStepControls
                ariaLabel={`${ariaLabel} (minutes)`}
                unit="min"
            />
            <NumberInput
                {...appearanceProps}
                value={seconds}
                className={styles["number-input"]}
                onChange={onSecondsChange}
                min={0}
                max={59}
                step={1}
                disabled={disabled}
                showStepControls
                ariaLabel={`${ariaLabel} (seconds)`}
                unit="s"
            />
        </div>
    );
};
