import { ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    ClockInputProps,
    ClockMode,
    CLOCK_INPUT_RANGE,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getClockDrawing,
    millisecondsToDurationParts,
    STEP_DEG,
    ThemeContext,
    useTheme,
} from "@ui";
import { ClockA11yInput } from "./ClockA11yInput";
import { ClockDial } from "./ClockDial";
import { ClockDurationNumberInputs } from "./ClockDurationNumberInputs";
import { useClockDrag } from "./useClockDrag";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from "./clock-input.module.css";

export const ClockControl: FC<
    ClockInputProps &
        Omit<ComponentProps<"div">, "onChange" | "value"> & { mode: ClockMode }
> = ({
    mode,
    id,
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    disabled = false,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    value,
    formatValue,
    min = CLOCK_INPUT_RANGE[0],
    max = CLOCK_INPUT_RANGE[1],
    step = STEP_DEG,
    onChange,
    label,
    ariaLabel,
    thumbIcon,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = "end",
    className,
    style,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const duration = mode === "duration";
    const drawing = getClockDrawing(
        theme.sizes.control[size].height,
        mode,
        value,
        min,
        max,
    );
    const { minutes, seconds } = millisecondsToDurationParts(value);
    const { dragging, inputRef, pointerEvents } = useClockDrag({
        mode,
        value,
        min,
        max,
        step,
        center: drawing.center,
        outerRadius: drawing.outerRadius,
        disabled,
        onChange,
    });
    const appearanceProps = {
        color,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        disabled,
        size,
        variant,
    };
    const clock = (
        <ClockDial
            drawing={drawing}
            pointerEvents={pointerEvents}
            thumbIcon={thumbIcon}
        />
    );

    return (
        <ThemeContext.Provider value={theme}>
            <div
                {...props}
                data-appearance-mode={theme.mode}
                data-appearance-variant={variant}
                data-appearance-color={color}
                data-appearance-highlight={highlightColor}
                data-highlighted={highlighted}
                data-disabled={disabled}
                data-dragging={dragging}
                className={classNames(
                    styles.container,
                    duration &&
                        showNumberInput &&
                        styles["with-duration-inputs"],
                    styles[`size-${size}`],
                    className,
                )}
                style={
                    {
                        ...style,
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
                <ClockA11yInput
                    inputRef={inputRef}
                    id={inputId}
                    min={min}
                    max={duration ? undefined : max}
                    step={step}
                    value={value}
                    formatValue={
                        duration
                            ? () => `${minutes} min ${seconds} s`
                            : formatValue
                    }
                    onChange={onChange}
                    disabled={disabled}
                    label={label}
                    showValue={!showNumberInput}
                    ariaLabel={
                        ariaLabel ??
                        (duration ? "Duration (milliseconds)" : undefined)
                    }
                />
                <div
                    className={classNames(
                        styles["control-row"],
                        showNumberInput &&
                            styles[`number-input-${numberInputPlacement}`],
                    )}
                >
                    {showStepControls ? (
                        <StepControls
                            color={color}
                            size={size}
                            variant={variant}
                            value={value}
                            min={min}
                            max={duration ? undefined : max}
                            step={step}
                            onChange={onChange}
                            disabled={disabled}
                            ariaLabel={ariaLabel ?? label}
                        >
                            {clock}
                        </StepControls>
                    ) : (
                        clock
                    )}
                    {showNumberInput ? (
                        duration ? (
                            <ClockDurationNumberInputs
                                {...appearanceProps}
                                value={value}
                                min={min}
                                onChange={onChange}
                                ariaLabel={ariaLabel}
                            />
                        ) : (
                            <NumberInput
                                {...appearanceProps}
                                value={value}
                                className={styles["number-input"]}
                                onChange={(next) => onChange?.(next)}
                                min={min}
                                max={max}
                                step={step}
                                disabled={disabled || !onChange}
                                showStepControls
                                ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                            />
                        )
                    ) : null}
                </div>
            </div>
        </ThemeContext.Provider>
    );
};
