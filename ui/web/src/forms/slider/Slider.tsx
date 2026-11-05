import { ComponentProps, FC, useId } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    SliderProps,
    useTheme,
} from "@ui";
import { Label, Span } from "../../design-system/typography";
import { SliderControlRow } from "./SliderControlRow";
import { SliderTrack } from "./SliderTrack";
import styles from "./slider.module.css";

export const Slider: FC<
    SliderProps & Omit<ComponentProps<"input">, "onChange" | "size">
> = ({
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    highlighted = false,
    disabled = false,
    id,
    label,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    ariaLabel,
    ...props
}) => {
    const theme = useTheme();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const accessibleLabel =
        ariaLabel ??
        props["aria-label"] ??
        (typeof label === "string" ? label : undefined);
    const appearanceProps = {
        color,
        glyphsShade,
        highlightColor,
        highlightGlyphsShade,
        size,
        variant,
        highlighted,
        disabled,
    };

    return (
            <div
                className={styles.container}
                data-size={size}
                data-appearance-mode={theme.mode}
                data-appearance-variant={variant}
                data-appearance-color={color}
                data-appearance-highlight={highlightColor}
                data-highlighted={highlighted || undefined}
                data-disabled={disabled || undefined}
                data-glow={activeGlow}
            >
                {typeof label === "string" ? (
                    <Label
                        htmlFor={inputId}
                        color={color}
                        shade={glyphsShade}
                        highlightColor={highlightColor}
                        highlightShade={highlightGlyphsShade}
                        highlighted={highlighted}
                        disabled={disabled}
                        className={styles.label}
                    >
                        {label}{" "}
                        {!showNumberInput ? <Span tabular>{value}</Span> : null}
                    </Label>
                ) : (
                    label
                )}
                <SliderControlRow
                    {...appearanceProps}
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    ariaLabel={accessibleLabel}
                    showNumberInput={showNumberInput}
                    showStepControls={showStepControls}
                    stepControlsProps={stepControlsProps}
                >
                    <SliderTrack
                        {...props}
                        id={inputId}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        ariaLabel={accessibleLabel}
                    />
                </SliderControlRow>
            </div>
    );
};
