import { FC } from "react";
import { IconRotateInputProps } from "@ui";
import styles from "./icon-rotate-input.module.css";

export const RotateA11yInput: FC<IconRotateInputProps> = ({
    id,
    min,
    max,
    step,
    value,
    onChange,
    disabled,
    label,
    ariaLabel,
}) => (
    <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange?.(Number(event.target.value))}
        onKeyDown={(event) => {
            if (min === undefined || max === undefined || max - min < 360) {
                return;
            }
            if (
                (event.key === "ArrowLeft" || event.key === "ArrowDown") &&
                value <= min
            ) {
                event.preventDefault();
                onChange?.(max);
            } else if (
                (event.key === "ArrowRight" || event.key === "ArrowUp") &&
                value >= max
            ) {
                event.preventDefault();
                onChange?.(min);
            }
        }}
        disabled={disabled}
        className={styles["a11y-slider"]}
        aria-label={ariaLabel ?? label ?? "Angle"}
        aria-valuetext={`${value}°`}
    />
);
