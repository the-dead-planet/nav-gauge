import { FC, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    FontType,
    Icons,
    NumberInputProps,
    ThemeAppearanceState,
    useStepRepeat,
    useTheme,
} from "@ui";
import { Button } from "../../gizmos/button";
import { Text } from "../../design-system/typography";
import { resolveMobileFont } from "../../design-system/typography/fontFamily";

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    field: {
        flexDirection: "row",
        alignItems: "stretch",
        boxSizing: "border-box",
        borderRadius: 0,
        overflow: "hidden",
    },
    input: {
        flex: 1,
        boxSizing: "border-box",
        borderWidth: 0,
        borderRadius: 0,
        fontFamily: resolveMobileFont(FontType.Numeric).fontFamily,
        fontVariant: ["tabular-nums"],
    },
    unit: {
        alignSelf: "center",
        marginHorizontal: 4,
        fontFamily: resolveMobileFont(FontType.Numeric).fontFamily,
        fontVariant: ["tabular-nums"],
    },
    steppers: {
        flexShrink: 0,
        borderLeftWidth: 1,
    },
    stepper: {
        flex: 1,
        height: "auto",
        minWidth: 0,
        minHeight: 0,
        paddingHorizontal: 2,
        paddingVertical: 0,
        borderRadius: 0,
    },
});

export const NumberInput: FC<NumberInputProps> = ({
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    value,
    onChange,
    disabled = false,
    highlighted = false,
    ariaLabel,
    unit,
    min,
    max,
    step,
    autoSelect = false,
    showStepControls = true,
}) => {
    const theme = useTheme().forMode(themeMode);
    const [focused, setFocused] = useState(false);
    const state: ThemeAppearanceState = disabled
        ? "disabled"
        : highlighted
            ? "active-pressed"
            : focused
                ? "hover-focus"
                : "default";
    const appearance = theme.resolveAppearance(variant, color, highlightColor, state);
    const interactive = state === "hover-focus" || state === "active-pressed";
    const overrideShade = interactive ? highlightGlyphsShade : glyphsShade;
    const glyphs = disabled || overrideShade === undefined
        ? appearance.glyphs
        : theme.color(interactive ? highlightColor : color, overrideShade);
    const controlSize = theme.sizes.control[size];
    const incrementDisabled = disabled || (max !== undefined && value >= max);
    const decrementDisabled = disabled || (min !== undefined && value <= min);
    const stepRepeat = useStepRepeat({ value, onChange, step, min, max, disabled });

    const handleChange = (text: string) => {
        const parsed = Number(text);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
        <View style={styles.container}>
            {label ? (
                <Text
                    themeMode={themeMode}
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    appearanceState={state}
                    style={{ fontSize: controlSize.fontSize }}
                >
                    {label}
                </Text>
            ) : null}
            <View
                style={[
                    styles.field,
                    {
                        backgroundColor: appearance.surface,
                        borderColor: appearance.border.color,
                        borderWidth: appearance.border.width,
                        height: controlSize.height,
                        outlineStyle: "solid",
                        outlineWidth: focused ? 2 : 0,
                        outlineOffset: 2,
                        outlineColor: appearance.effects.glowColor,
                    },
                ]}
            >
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: glyphs,
                            fontSize: controlSize.fontSize,
                            paddingHorizontal: controlSize.paddingInline,
                            height: "100%",
                            paddingVertical: 0,
                        },
                    ]}
                    value={String(value)}
                    onChangeText={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType="decimal-pad"
                    selectTextOnFocus={autoSelect}
                    accessibilityLabel={ariaLabel || (typeof label === "string" ? label : undefined)}
                    editable={!disabled}
                />
                {unit ? (
                    <Text
                        fontType={FontType.Numeric}
                        style={[
                            styles.unit,
                            {
                                color: glyphs,
                                fontSize: controlSize.fontSize,
                            },
                        ]}
                    >
                        {unit}
                    </Text>
                ) : null}
                {showStepControls ? (
                    <View style={[styles.steppers, { borderLeftColor: appearance.border.color }]}>
                        <Button
                            icon={Icons.NounProject.ChevronDownSingle}
                            iconRotateZ={180}
                            color={color}
                            highlightColor={highlightColor}
                            highlightGlyphsShade={highlightGlyphsShade}
                            glyphsShade={glyphsShade}
                            size={size}
                            disabled={incrementDisabled}
                            highlighted={highlighted}
                            onPressIn={() => stepRepeat.start(1)}
                            onPressOut={stepRepeat.stop}
                            accessibilityLabel={ariaLabel ? `${ariaLabel} (+)` : "+"}
                            style={styles.stepper}
                            themeMode={themeMode}
                        />
                        <Button
                            icon={Icons.NounProject.ChevronDownSingle}
                            color={color}
                            highlightColor={highlightColor}
                            highlightGlyphsShade={highlightGlyphsShade}
                            glyphsShade={glyphsShade}
                            size={size}
                            disabled={decrementDisabled}
                            highlighted={highlighted}
                            onPressIn={() => stepRepeat.start(-1)}
                            onPressOut={stepRepeat.stop}
                            accessibilityLabel={ariaLabel ? `${ariaLabel} (−)` : "−"}
                            style={[
                                styles.stepper,
                                {
                                    borderTopWidth: 1,
                                    borderTopColor: appearance.border.color,
                                },
                            ]}
                            themeMode={themeMode}
                        />
                    </View>
                ) : null}
            </View>
        </View>
    );
};
