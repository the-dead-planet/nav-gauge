import { forwardRef } from "react";
import { StyleSheet, View, ViewStyle, type ViewInstance } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getSliderRatio,
    sliderSizes,
    SliderProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { Text } from "../../design-system/typography";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import { useSliderInteraction } from "./useSliderInteraction";

const styles = StyleSheet.create({
    container: {
        gap: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    slider: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },
    hitArea: {
        justifyContent: "center",
    },
    track: {
        position: "relative",
    },
    remainder: {
        ...StyleSheet.absoluteFill,
        opacity: 0.25,
    },
    progress: {
        height: "100%",
    },
    thumb: {
        position: "absolute",
        transform: [{ rotate: "45deg" }],
    },
    numberInput: {
        width: 80,
        flexShrink: 0,
    },
});

export const Slider = forwardRef<
    ViewInstance,
    SliderProps & { style?: ViewStyle }
>(
    (
        {
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
            label,
            showNumberInput = false,
            showStepControls = false,
            ariaLabel,
            style,
        },
        ref,
    ) => {
        const theme = useTheme().forMode(themeMode);
        const { state, focused, width, interaction, adjustValue } =
            useSliderInteraction({
                value,
                min,
                max,
                step,
                disabled,
                highlighted,
                onChange,
            });
        const appearance = theme.resolveAppearance(
            variant,
            color,
            highlightColor,
            state,
        );
        const labelAppearance = theme.resolveAppearance(
            "default",
            color,
            highlightColor,
            state,
            glyphsShade,
            highlightGlyphsShade,
        );
        const controlSize = theme.sizes.control[size];
        const { thumb, track } = sliderSizes[size];
        const fillWidth = width * getSliderRatio(value, min, max);
        const accessibleLabel =
            ariaLabel ?? (typeof label === "string" ? label : "Slider");

        const slider = (
            <View style={[styles.slider, { height: controlSize.height }]}>
                <View
                    {...interaction}
                    accessible
                    accessibilityRole="adjustable"
                    accessibilityLabel={accessibleLabel}
                    accessibilityState={{ disabled }}
                    accessibilityValue={{ min, max, now: value }}
                    accessibilityActions={[
                        { name: "increment" },
                        { name: "decrement" },
                    ]}
                    onAccessibilityAction={(event) => {
                        if (event.nativeEvent.actionName === "increment") {
                            adjustValue(1);
                        } else if (
                            event.nativeEvent.actionName === "decrement"
                        ) {
                            adjustValue(-1);
                        }
                    }}
                    focusable={!disabled}
                    style={[
                        styles.hitArea,
                        {
                            height: controlSize.height,
                            marginHorizontal: thumb / 2,
                            outlineStyle: "solid",
                            outlineWidth: focused ? 2 : 0,
                            outlineOffset: 2,
                            outlineColor: appearance.effects.glowColor,
                        },
                    ]}
                >
                    <View
                        pointerEvents="none"
                        style={[styles.track, { height: track }]}
                    >
                        <View
                            style={[
                                styles.remainder,
                                { backgroundColor: appearance.glyphs },
                            ]}
                        />
                        <View
                            style={[
                                styles.progress,
                                {
                                    width: fillWidth,
                                    backgroundColor: appearance.glyphs,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.thumb,
                                {
                                    left: fillWidth - thumb / 2,
                                    top: (track - thumb) / 2,
                                    width: thumb,
                                    height: thumb,
                                    backgroundColor: appearance.surface,
                                    borderColor: appearance.border.color,
                                    borderWidth: appearance.border.width,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>
        );

        return (
            <ThemeContext.Provider value={theme}>
                <View ref={ref} style={[styles.container, style]}>
                    {typeof label === "string" ? (
                        <Text
                            style={{
                                color: labelAppearance.glyphs,
                                fontSize: controlSize.fontSize,
                            }}
                        >
                            {label} {!showNumberInput ? value : null}
                        </Text>
                    ) : (
                        label
                    )}
                    <View
                        style={[
                            styles.row,
                            {
                                gap: controlSize.gap,
                                minHeight: controlSize.height,
                            },
                        ]}
                    >
                        {showStepControls ? (
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
                        )}
                        {showNumberInput ? (
                            <View style={styles.numberInput}>
                                <NumberInput
                                    themeMode={themeMode}
                                    value={value}
                                    onChange={(newValue) =>
                                        onChange?.(newValue)
                                    }
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
                                    showStepControls
                                    ariaLabel={`${accessibleLabel} (#)`}
                                />
                            </View>
                        ) : null}
                    </View>
                </View>
            </ThemeContext.Provider>
        );
    },
);

Slider.displayName = "Slider";
