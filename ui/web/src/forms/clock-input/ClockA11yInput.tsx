import { FC } from "react";
import { ClockInputProps } from "@ui";
import { Label } from "../../design-system/typography";
import styles from "./clock-input.module.css";

interface Props extends Pick<
    ClockInputProps,
    | "color"
    | "highlightColor"
    | "glyphsShade"
    | "highlightGlyphsShade"
    | "highlighted"
> {
    id: string;
    min: number;
    max?: number;
    step: number;
    value: number;
    formatValue?: (value: number) => string;
    onChange?: (value: number) => void;
    disabled: boolean;
    label?: string;
    showValue: boolean;
    ariaLabel?: string;
}

export const ClockA11yInput: FC<Props> = ({
    id,
    min,
    max,
    step,
    value,
    formatValue,
    onChange,
    disabled,
    label,
    showValue,
    ariaLabel,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
}) => (
    <>
        <input
            type={max === undefined ? "number" : "range"}
            id={id}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => {
                const next = event.target.valueAsNumber;
                if (Number.isFinite(next)) {
                    onChange?.(Math.max(min, next));
                }
            }}
            onKeyDown={(event) => {
                if (max === undefined) {
                    return;
                }
                if (event.key === "ArrowLeft" && value <= min) {
                    event.preventDefault();
                    onChange?.(max);
                } else if (event.key === "ArrowRight" && value >= max) {
                    event.preventDefault();
                    onChange?.(min);
                }
            }}
            disabled={disabled}
            className={styles["a11y-slider"]}
            aria-label={ariaLabel ?? label ?? "Angle"}
            aria-valuetext={formatValue?.(value)}
        />
        {label ? (
            <Label
                htmlFor={id}
                className={styles.label}
                color={color}
                highlightColor={highlightColor}
                shade={glyphsShade}
                highlightShade={highlightGlyphsShade}
                highlighted={highlighted}
                disabled={disabled}
            >
                {label}
                {showValue ? (
                    <span>{formatValue?.(value) ?? `${value}°`}</span>
                ) : null}
            </Label>
        ) : null}
    </>
);
