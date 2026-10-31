import { ComponentProps, FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    FontType,
    TextAreaProps,
    ThemeAppearanceState,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import { resolveMobileFont } from "../../design-system/typography/fontFamily";

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    field: {
        boxSizing: "border-box",
        borderRadius: 0,
        overflow: "hidden",
    },
    textarea: {
        boxSizing: "border-box",
        borderWidth: 0,
        borderRadius: 0,
        textAlignVertical: "top",
        fontFamily: resolveMobileFont(FontType.Default).fontFamily,
    },
});

export const TextArea: FC<
    TextAreaProps
        & Omit<ComponentProps<typeof RNTextInput>, "value" | "onChange" | "onChangeText" | "multiline">
> = ({
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
    autoSelect = false,
    editable = true,
    highlighted = false,
    disabled = false,
    style,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const [focused, setFocused] = useState(false);
    const isDisabled = disabled || !editable;
    const state: ThemeAppearanceState = isDisabled
        ? "disabled"
        : highlighted
            ? "active-pressed"
            : focused
                ? "hover-focus"
                : "default";
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
        glyphsShade,
        highlightGlyphsShade,
    );
    const controlSize = theme.sizes.control[size];

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
                        outlineStyle: "solid",
                        outlineWidth: focused ? 2 : 0,
                        outlineOffset: 2,
                        outlineColor: appearance.effects.glowColor,
                    },
                ]}
            >
                <RNTextInput
                    {...props}
                    style={[
                        styles.textarea,
                        {
                            color: appearance.glyphs,
                            fontSize: controlSize.fontSize,
                            minHeight: controlSize.height,
                            paddingHorizontal: controlSize.paddingInline,
                            paddingVertical: controlSize.paddingBlock,
                        },
                        style,
                    ]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={appearance.glyphs}
                    onChangeText={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    editable={!isDisabled}
                    selectTextOnFocus={autoSelect}
                    accessibilityLabel={props.accessibilityLabel ?? label}
                    accessibilityState={{
                        ...props.accessibilityState,
                        disabled: isDisabled,
                    }}
                    multiline
                />
            </View>
        </View>
    );
};
