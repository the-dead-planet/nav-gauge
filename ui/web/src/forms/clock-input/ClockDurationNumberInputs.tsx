import { FC } from "react";
import { ClockDurationNumberInputsProps, useClockDurationInput } from "@ui";
import { CompanionNumberInput } from "../number-input/CompanionNumberInput";
import styles from "./clock-input.module.css";

export const ClockDurationNumberInputs: FC<ClockDurationNumberInputsProps> = ({
    value,
    min,
    onChange,
    ariaLabel = "Duration",
    numberInputPlacement = "end",
    ...appearanceProps
}) => {
    const { minutes, seconds, onMinutesChange, onSecondsChange } =
        useClockDurationInput({ value, min, onChange });
    const disabled = appearanceProps.disabled || !onChange;

    return (
        <div className={styles["duration-number-inputs"]}>
            <CompanionNumberInput
                placement={numberInputPlacement}
                {...appearanceProps}
                value={minutes}
                onChange={onMinutesChange}
                min={0}
                step={1}
                disabled={disabled}
                showStepControls
                ariaLabel={`${ariaLabel} (minutes)`}
                unit="min"
            />
            <CompanionNumberInput
                placement={numberInputPlacement}
                {...appearanceProps}
                value={seconds}
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
