import { forwardRef } from "react";
import { StyleSheet, View, ViewStyle, type ViewInstance } from "react-native";
import {
    ClockInputProps,
    ClockMode,
    CLOCK_INPUT_RANGE,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getClockDrawing,
    STEP_DEG,
    ThemeContext,
    useTheme,
} from "@ui";
import { ClockDial } from "./ClockDial";
import { ClockDurationNumberInputs } from "./ClockDurationNumberInputs";
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
        const drawing = getClockDrawing(
            theme.sizes.control[size].height,
            mode,
            value,
            min,
            max,
        );
        const gesture = useClockDrag({
            mode,
            value,
            min,
            max,
            step,
            center: drawing.center,
            outerRadius: drawing.outerRadius,
            viewBox: drawing.viewBox,
            disabled,
            onChange,
        });
        const { state, interaction, focused } = useHudInteraction({
            disabled,
            highlighted: highlighted || gesture.dragging,
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
        const clock = (
            <ClockDial
                id={id}
                value={value}
                formatValue={formatValue}
                label={label}
                ariaLabel={ariaLabel}
                disabled={disabled}
                thumbIcon={thumbIcon}
                mode={mode}
                min={min}
                max={max}
                drawing={drawing}
                gesture={gesture}
                interaction={interaction}
                focused={focused}
                appearance={appearance}
                glyphs={glyphs}
            />
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
                                        drawing.svgSize +
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
                                <ClockDurationNumberInputs
                                    {...appearanceProps}
                                    value={value}
                                    min={min}
                                    onChange={onChange}
                                    ariaLabel={ariaLabel}
                                    numberInputPlacement={numberInputPlacement}
                                />
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
