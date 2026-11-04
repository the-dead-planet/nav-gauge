import { FC } from "react";
import { IconRotateInputProps } from "@ui";
import { Label } from "../../design-system/typography";
import styles from "./icon-rotate-input.module.css";

interface Props extends IconRotateInputProps {
    showValue: boolean;
}

export const RotateA11yInput: FC<Props> = ({
    id,
    min,
    max,
    step,
    value,
    onChange,
    disabled,
    label,
    showValue,
    ariaLabel,
    themeMode,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
}) => (
    <>
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
        {label ? (
            <Label
                htmlFor={id}
                themeMode={themeMode}
                color={color}
                highlightColor={highlightColor}
                shade={glyphsShade}
                highlightShade={highlightGlyphsShade}
                highlighted={highlighted}
                disabled={disabled}
                className={styles.label}
            >
                {label} {showValue ? <span>{value}°</span> : null}
            </Label>
        ) : null}
    </>
);
