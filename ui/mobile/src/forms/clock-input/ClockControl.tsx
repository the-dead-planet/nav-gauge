import { forwardRef } from "react";
import {
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
    type ViewInstance,
} from "react-native";
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
import { ClockSvg } from "./ClockSvg";
import { ClockLabel } from "./ClockLabel";
import { useClockDrag } from "./useClockDrag";
import { useHudInteraction } from "../../hud/useHudInteraction";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 4,
    },
    fullWidth: {
        width: "100%",
    },
    row: {
        flexDirection: "row",
        maxWidth: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    start: { flexDirection: "row-reverse" },
    above: { flexDirection: "column-reverse" },
    below: { flexDirection: "column" },
    end: { flexDirection: "row" },
    numberInput: {
        width: 120,
        minWidth: 120,
    },
    verticalInput: {
        width: "100%",
    },
    durationInputs: {
        flexDirection: "row",
        minWidth: 0,
        gap: 8,
    },
    horizontalInputs: {
        flex: 1,
    },
    durationInput: {
        flex: 1,
        minWidth: 0,
    },
});

export const ClockControl = forwardRef<
    ViewInstance,
    ClockInputProps & { mode: ClockMode; style?: ViewStyle }
>(
    (
        {
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
            style,
        },
        ref,
    ) => {
        const theme = useTheme().forMode(themeMode);
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
                ? arcViewBox(
                      center,
                      center,
                      outerRadius + strokeWidth,
                      min,
                      max,
                  )
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
        const { dragging, viewRef, panHandlers } = useClockDrag({
            mode,
            value,
            min,
            max,
            step,
            center,
            outerRadius,
            viewBox,
            disabled,
            onChange,
        });
        const { state, interaction, focused } = useHudInteraction({
            disabled,
            highlighted: highlighted || dragging,
        });
        const appearance = theme.resolveAppearance(
            variant,
            color,
            highlightColor,
            state,
        );
        const interactive =
            state === "hover-focus" || state === "active-pressed";
        const shade = interactive ? highlightGlyphsShade : glyphsShade;
        const glyphs =
            disabled || shade === undefined
                ? appearance.glyphs
                : theme.color(interactive ? highlightColor : color, shade);
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
        const clock = (
            <Pressable
                nativeID={id}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel={
                    ariaLabel ?? label ?? (duration ? "Duration" : "Angle")
                }
                accessibilityState={{ disabled }}
                accessibilityValue={{
                    min,
                    max: duration ? undefined : max,
                    now: value,
                    text: duration
                        ? `${minutes} min ${seconds} s`
                        : (formatValue?.(value) ?? `${value}°`),
                }}
                accessibilityActions={[
                    { name: "increment" },
                    { name: "decrement" },
                ]}
                onAccessibilityAction={(event) => {
                    if (
                        !disabled &&
                        (event.nativeEvent.actionName === "increment" ||
                            event.nativeEvent.actionName === "decrement")
                    ) {
                        const next =
                            value +
                            (event.nativeEvent.actionName === "increment"
                                ? step
                                : -step);
                        onChange?.(
                            Math.max(
                                min,
                                duration ? next : Math.min(max, next),
                            ),
                        );
                    }
                }}
                disabled={disabled}
                onHoverIn={interaction.onHoverIn}
                onHoverOut={interaction.onHoverOut}
                onFocus={interaction.onFocus}
                onBlur={interaction.onBlur}
                style={{
                    outlineStyle: "solid",
                    outlineWidth: focused ? 2 : 0,
                    outlineColor: appearance.effects.glowColor,
                    outlineOffset: 2,
                }}
            >
                <View ref={viewRef} collapsable={false} {...panHandlers}>
                    <ClockSvg
                        svgSize={svgSize}
                        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                        center={center}
                        outerRadius={outerRadius}
                        strokeWidth={strokeWidth}
                        hands={hands}
                        centerDotRadius={centerDotRadius}
                        thumbRadius={thumbRadius}
                        min={duration ? 0 : min}
                        max={duration ? 360 : max}
                        fullCircle={fullCircle}
                        wedge={wedge}
                        appearance={appearance}
                        glyphs={glyphs}
                        thumbIcon={thumbIcon}
                    />
                </View>
            </Pressable>
        );
        const vertical =
            numberInputPlacement === "above" ||
            numberInputPlacement === "below";

        return (
            <ThemeContext.Provider value={theme}>
                <View
                    ref={ref}
                    style={[
                        styles.container,
                        duration && showNumberInput && styles.fullWidth,
                        style,
                    ]}
                >
                    <ClockLabel
                        label={label}
                        value={value}
                        formatValue={formatValue}
                        showValue={!showNumberInput}
                        color={color}
                        highlightColor={highlightColor}
                        glyphsShade={glyphsShade}
                        highlightGlyphsShade={highlightGlyphsShade}
                        state={state}
                    />
                    <View
                        style={[
                            styles.row,
                            duration && showNumberInput && styles.fullWidth,
                            showNumberInput && styles[numberInputPlacement],
                        ]}
                    >
                        {showStepControls ? (
                            <View
                                style={{
                                    width:
                                        svgSize +
                                        theme.sizes.control[size].height * 2 +
                                        8,
                                }}
                            >
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
                            </View>
                        ) : (
                            clock
                        )}
                        {showNumberInput ? (
                            duration ? (
                                <View
                                    style={[
                                        styles.durationInputs,
                                        vertical
                                            ? styles.verticalInput
                                            : styles.horizontalInputs,
                                    ]}
                                >
                                    <View style={styles.durationInput}>
                                        <NumberInput
                                            {...appearanceProps}
                                            value={minutes}
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
                                    </View>
                                    <View style={styles.durationInput}>
                                        <NumberInput
                                            {...appearanceProps}
                                            value={seconds}
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
                                    </View>
                                </View>
                            ) : (
                                <View
                                    style={[
                                        styles.numberInput,
                                        vertical && styles.verticalInput,
                                    ]}
                                >
                                    <NumberInput
                                        {...appearanceProps}
                                        value={value}
                                        onChange={(next) => onChange?.(next)}
                                        min={min}
                                        max={max}
                                        step={step}
                                        disabled={disabled || !onChange}
                                        showStepControls
                                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                                    />
                                </View>
                            )
                        ) : null}
                    </View>
                </View>
            </ThemeContext.Provider>
        );
    },
);
ClockControl.displayName = "ClockControl";
