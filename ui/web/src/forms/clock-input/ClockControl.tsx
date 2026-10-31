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
import { ClockControlRow } from "./ClockControlRow";
import { ClockDial } from "./ClockDial";
import { useClockDrag } from "./useClockDrag";
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
                <ClockControlRow
                    {...appearanceProps}
                    mode={mode}
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={onChange}
                    label={label}
                    ariaLabel={ariaLabel}
                    showNumberInput={showNumberInput}
                    showStepControls={showStepControls}
                    numberInputPlacement={numberInputPlacement}
                >
                    <ClockDial
                        drawing={drawing}
                        pointerEvents={pointerEvents}
                        thumbIcon={thumbIcon}
                    />
                </ClockControlRow>
            </div>
        </ThemeContext.Provider>
    );
};
