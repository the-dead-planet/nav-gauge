import { FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import {
    controlTextSpecifications,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    FontType,
    TextInputProps,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import { resolveMobileFont } from "../../design-system/typography/fontFamily";
import { TRANSLUCENT_OPACITY } from "../../tinkers";

const styles = StyleSheet.create({
    container: {
        rowGap: 2,
    },
    label: {},
    input: {
        borderWidth: 1,
        borderRadius: 4,
        boxSizing: "border-box",
        fontFamily: resolveMobileFont(FontType.Default).fontFamily,
    },
});

export const TextInput: FC<TextInputProps> = ({
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
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const isHighlighted = !disabled && (highlighted || isFocused);
    const borderColor = isHighlighted
        ? theme.color(highlightColor, theme.isLight ? 600 : 300)
        : theme.color(color, 500, variant === "fill-translucent" ? 0.3 : 1);
    const fontSize = controlTextSpecifications[size].fontSize;
    const paddingV = size === "xs" ? 0 : size === "sm" ? 2 : 6;
    const disabledColor = theme.color(color, theme.isLight ? 300 : 700);
    const textColor = isHighlighted && highlightGlyphsShade !== undefined
        ? theme.color(highlightColor, highlightGlyphsShade)
        : glyphsShade !== undefined
            ? theme.color(color, glyphsShade)
            :
            variant === "fill"
                ? theme.color(color, theme.contrastShade(color))
                : theme.color(color, theme.isLight ? 900 : 100);
    const placeholderTextColor = disabled
        ? disabledColor
        : theme.color(
            color,
            variant === "fill"
                ? theme.contrastShade(color)
                : theme.isLight
                    ? 900
                    : 100,
            0.5,
        );
    const backgroundColor = disabled
        ? theme.color(color, theme.isLight ? 200 : 800)
        : variant === "fill"
            ? theme.color(color, 500)
            : variant === "fill-inverse"
                ? theme.color(color, theme.isLight ? 100 : 900)
                : theme.color(color, 500, TRANSLUCENT_OPACITY);

    return (
        <View style={styles.container}>
            {label ? (
                <Label
                    color={color}
                    shade={glyphsShade}
                    disabled={disabled}
                    style={[
                        styles.label,
                        { fontSize: size === "xs" ? 11 : 12 },
                    ]}
                >
                    {label}
                </Label>
            ) : null}
            <RNTextInput
                style={[
                    styles.input,
                    {
                        backgroundColor,
                        color: disabled ? disabledColor : textColor,
                        borderColor: disabled
                            ? disabledColor
                            : variant === "fill"
                                ? backgroundColor
                                : borderColor,
                        borderWidth: disabled || variant !== "fill" ? 1 : 0,
                        fontSize,
                        paddingVertical: paddingV,
                        paddingHorizontal: 8,
                    },
                ]}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChange}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectTextOnFocus={autoSelect}
            />
        </View>
    );
};
