import { ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    arcViewBox,
    ClockInputProps,
    ClockMode,
    CLOCK_INPUT_RANGE,
    describeClockWedge,
    durationPartsToMilliseconds,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getClockGeometry,
    millisecondsToDurationParts,
    MINUTES_HAND_FRACTION,
    pointerCoords,
    STEP_DEG,
    ThemeContext,
    ticksToClockDegrees,
    useTheme,
} from "@ui";
import { ClockA11yInput } from "./ClockA11yInput";
import { ClockSvg } from "./ClockSvg";
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
    const {
        svgSize,
        center,
        outerRadius,
        strokeWidth,
        centerDotRadius,
        thumbRadius,
    } = getClockGeometry(theme.sizes.control[size].height, mode);
    const fullCircle = mode !== "slice" || max - min >= 360;
    const viewBox =
        mode === "slice" && !fullCircle
            ? arcViewBox(center, center, outerRadius + strokeWidth, min, max)
            : { x: 0, y: 0, width: svgSize, height: svgSize };
    const { minutes, seconds } = millisecondsToDurationParts(value);
    const hands = duration
        ? [
              pointerCoords(
                  ticksToClockDegrees(minutes),
                  outerRadius * MINUTES_HAND_FRACTION,
              ),
              pointerCoords(ticksToClockDegrees(seconds), outerRadius),
          ]
        : [pointerCoords(value, outerRadius)];
    const { dragging, inputRef, pointerEvents } = useClockDrag({
        mode,
        value,
        min,
        max,
        step,
        center,
        outerRadius,
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
    const emitDuration = (nextMinutes: number, nextSeconds: number) =>
        onChange?.(
            Math.max(
                min,
                durationPartsToMilliseconds({
                    minutes: nextMinutes,
                    seconds: nextSeconds,
                }),
            ),
        );
    const wedge = describeClockWedge(center, outerRadius, min, max);
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" preserveAspectRatio="none">${fullCircle ? `<circle cx="${center}" cy="${center}" r="${outerRadius}" fill="white"/>` : `<path d="${wedge}" fill="white"/>`}</svg>`)}")`;
    const clock = (
        <span className={styles.drawing}>
            <span
                className={styles.backdrop}
                style={{
                    maskImage: backdropMask,
                    WebkitMaskImage: backdropMask,
                }}
                aria-hidden="true"
            />
            <ClockSvg
                svgSize={svgSize}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                pointerEvents={pointerEvents}
                center={center}
                outerRadius={outerRadius}
                strokeWidth={strokeWidth}
                hands={hands}
                centerDotRadius={centerDotRadius}
                thumbRadius={thumbRadius}
                min={duration ? 0 : min}
                max={duration ? 360 : max}
                thumbIcon={thumbIcon}
            >
                {fullCircle ? (
                    <circle
                        cx={center}
                        cy={center}
                        r={outerRadius}
                        className={styles.surface}
                    />
                ) : (
                    <path d={wedge} className={styles.surface} />
                )}
            </ClockSvg>
        </span>
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
                            <div className={styles["duration-number-inputs"]}>
                                <NumberInput
                                    {...appearanceProps}
                                    value={minutes}
                                    className={styles["number-input"]}
                                    onChange={(next) =>
                                        emitDuration(next, seconds)
                                    }
                                    min={0}
                                    step={1}
                                    disabled={disabled || !onChange}
                                    showStepControls
                                    ariaLabel={`${ariaLabel ?? "Duration"} (minutes)`}
                                    unit="min"
                                />
                                <NumberInput
                                    {...appearanceProps}
                                    value={seconds}
                                    className={styles["number-input"]}
                                    onChange={(next) =>
                                        emitDuration(minutes, next)
                                    }
                                    min={0}
                                    max={59}
                                    step={1}
                                    disabled={disabled || !onChange}
                                    showStepControls
                                    ariaLabel={`${ariaLabel ?? "Duration"} (seconds)`}
                                    unit="s"
                                />
                            </div>
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
