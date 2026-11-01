import { ChangeEvent, ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getSliderRatio,
    SliderProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { Span } from "../../design-system/typography";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from "./slider.module.css";

export const Slider: FC<
    SliderProps & Omit<ComponentProps<"input">, "onChange" | "size">
> = ({
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
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
    ariaLabel,
    className,
    style,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const accessibleLabel =
        ariaLabel ??
        props["aria-label"] ??
        (typeof label === "string" ? label : undefined);
    const progress = getSliderRatio(value, min, max) * 100;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(e.target.value));
    };

    const slider = (
        <div
            className={styles["slider-wrapper"]}
            style={{ "--track-complete": `${progress}%` } as CSSProperties}
        >
            <div className={styles.track} aria-hidden="true">
                <div className={styles.progress} />
                <div className={styles.thumb} />
            </div>
            <input
                {...props}
                type="range"
                id={inputId}
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={handleChange}
                aria-label={accessibleLabel ?? "Slider"}
                className={classNames(styles.slider, className)}
                style={style}
            />
        </div>
    );
    const steppedSlider = showStepControls ? (
        <StepControls
            color={color}
            variant={variant}
            size={size}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            ariaLabel={accessibleLabel}
        >
            {slider}
        </StepControls>
    ) : (
        slider
    );

    return (
        <ThemeContext.Provider value={theme}>
            <div
                className={styles.container}
                data-size={size}
                data-appearance-mode={theme.mode}
                data-appearance-variant={variant}
                data-appearance-color={color}
                data-appearance-highlight={highlightColor}
                data-highlighted={highlighted || undefined}
                data-disabled={disabled || undefined}
                style={
                    {
                        "--appearance-default-glyphs-override":
                            glyphsShade === undefined
                                ? undefined
                                : theme.color(color, glyphsShade),
                        "--appearance-hover-focus-glyphs-override":
                            highlightGlyphsShade === undefined
                                ? undefined
                                : theme.color(
                                      highlightColor,
                                      highlightGlyphsShade,
                                  ),
                        "--appearance-active-pressed-glyphs-override":
                            highlightGlyphsShade === undefined
                                ? undefined
                                : theme.color(
                                      highlightColor,
                                      highlightGlyphsShade,
                                  ),
                    } as CSSProperties
                }
            >
                {typeof label === "string" ? (
                    <label
                        htmlFor={inputId}
                        data-appearance-variant="default"
                        className={styles.label}
                    >
                        {label}{" "}
                        {!showNumberInput ? <Span tabular>{value}</Span> : null}
                    </label>
                ) : (
                    label
                )}
                <div className={styles["control-row"]}>
                    {steppedSlider}
                    {showNumberInput ? (
                        <div className={styles["number-input"]}>
                            <NumberInput
                                themeMode={themeMode}
                                value={value}
                                onChange={(newValue) => onChange?.(newValue)}
                                min={min}
                                max={max}
                                step={step}
                                color={color}
                                glyphsShade={glyphsShade}
                                highlightColor={highlightColor}
                                highlightGlyphsShade={highlightGlyphsShade}
                                size={size}
                                variant={variant}
                                highlighted={highlighted}
                                disabled={disabled || !onChange}
                                showStepControls={true}
                                ariaLabel={`${accessibleLabel ?? "Slider"} (#)`}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </ThemeContext.Provider>
    );
};
