import { FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import {
    controlTextSpecifications,
    FontType,
    TextInputProps,
    useTheme,
} from "@ui";
import { Label } from "../../typography";
import { getMobileFontFamily } from "../../typography/fontFamily";
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
        fontFamily: getMobileFontFamily(FontType.Default),
    },
});

export const TextInput: FC<TextInputProps> = ({
    color = "neutral",
    highlightColor = color,
    size = "sm",
    variant = "fill-inverse",
    label,
    value,
    onChange,
    disabled = false,
    autoSelect = false,
}) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = isFocused
        ? theme.color(highlightColor, theme.isLight ? 600 : 300)
        : theme.color(color, 500, variant === "fill-translucent" ? 0.3 : 1);
    const fontSize = controlTextSpecifications[size].fontSize;
    const paddingV = size === "xs" ? 0 : size === "sm" ? 2 : 6;
    const disabledColor = theme.color(color, theme.isLight ? 300 : 700);
    const textColor =
        variant === "fill"
            ? theme.color(color, theme.contrastShade(color))
            : theme.color(color, theme.isLight ? 900 : 100);
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
                onChangeText={onChange}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectTextOnFocus={autoSelect}
            />
        </View>
    );
};
