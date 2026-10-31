import { FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    FontType,
    TextInputProps,
    ThemeAppearanceState,
    useTheme,
} from "@ui";
import { Label } from "../../design-system";
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
        paddingVertical: 0,
        fontFamily: resolveMobileFont(FontType.Default).fontFamily,
    },
});

export const TextInput: FC<TextInputProps> = ({
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
    highlighted = false,
    autoSelect = false,
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
    const selectedColor = interactive ? highlightColor : color;
    const overrideShade = interactive ? highlightGlyphsShade : glyphsShade;
    const glyphs = disabled || overrideShade === undefined
        ? appearance.glyphs
        : theme.color(selectedColor, overrideShade);
    const controlSize = theme.sizes.control[size];
    const placeholderTextColor = appearance.glyphs;

    return (
        <View style={styles.container}>
            {label ? (
                <Label
                    themeMode={themeMode}
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    appearanceState={state}
                    style={{ fontSize: controlSize.fontSize }}
                >
                    {label}
                </Label>
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
                <RNTextInput
                    style={[
                        styles.input,
                        {
                            color: glyphs,
                            fontSize: controlSize.fontSize,
                            paddingHorizontal: controlSize.paddingInline,
                            height: "100%",
                        },
                    ]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    editable={!disabled}
                    selectTextOnFocus={autoSelect}
                    accessibilityLabel={label}
                    accessibilityState={{ disabled }}
                />
            </View>
        </View>
    );
};
