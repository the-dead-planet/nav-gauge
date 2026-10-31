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
import { ClockControlRow } from "./ClockControlRow";
import { ClockDial } from "./ClockDial";
import { ClockLabel } from "./ClockLabel";
import { useClockDrag } from "./useClockDrag";
import { useHudInteraction } from "../../hud/useHudInteraction";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 4,
    },
    fullWidth: {
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
                    </ClockControlRow>
                </View>
            </ThemeContext.Provider>
        );
    },
);
ClockControl.displayName = "ClockControl";
