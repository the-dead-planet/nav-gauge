import { forwardRef } from "react";
import { StyleSheet, View, ViewStyle, type ViewInstance } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    SliderProps,
} from "@ui";
import { Label } from "../../design-system/typography";
import { SliderControlRow } from "./SliderControlRow";
import { SliderTrack } from "./SliderTrack";

const styles = StyleSheet.create({
    container: {
        gap: 4,
    },
});

export const Slider = forwardRef<
    ViewInstance,
    SliderProps & { style?: ViewStyle }
>(
    (
        {
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
            label,
            showNumberInput = false,
            showStepControls = false,
            stepControlsProps,
            ariaLabel,
            style,
        },
        ref,
    ) => {
        const accessibleLabel =
            ariaLabel ?? (typeof label === "string" ? label : "Slider");
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
            <View ref={ref} style={[styles.container, style]}>
                {typeof label === "string" ? (
                    <Label
                        color={color}
                        shade={glyphsShade}
                        highlightColor={highlightColor}
                        highlightShade={highlightGlyphsShade}
                        highlighted={highlighted}
                        disabled={disabled}
                    >
                        {label} {!showNumberInput ? value : null}
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
                        color={color}
                        highlightColor={highlightColor}
                        size={size}
                        variant={variant}
                        activeGlow={activeGlow}
                        highlighted={highlighted}
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        ariaLabel={accessibleLabel}
                    />
                </SliderControlRow>
            </View>
        );
    },
);

Slider.displayName = "Slider";
