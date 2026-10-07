import { ComponentProps, FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import {
    controlTextSpecifications,
    FontType,
    TextAreaProps,
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
    textarea: {
        borderWidth: 1,
        borderRadius: 4,
        minHeight: 60,
        textAlignVertical: "top",
        fontFamily: getMobileFontFamily(FontType.Default),
    },
});

export const TextArea: FC<
    TextAreaProps & ComponentProps<typeof RNTextInput>
> = ({
    color = "neutral",
    highlightColor = color,
    size = "sm",
    variant = "fill-inverse",
    label,
    autoSelect = false,
    editable = true,
    ...props
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
    const backgroundColor = !editable
        ? theme.color(color, theme.isLight ? 200 : 800)
        : variant === "fill"
          ? theme.color(color, 500)
          : variant === "fill-inverse"
            ? theme.color(color, theme.isLight ? 100 : 900)
            : theme.color(color, 500, TRANSLUCENT_OPACITY);

    return (
        <View style={styles.container}>
            <Label
                color={color}
                disabled={!editable}
                style={[styles.label, { fontSize: size === "xs" ? 11 : 12 }]}
            >
                {label}
            </Label>
            <RNTextInput
                style={[
                    styles.textarea,
                    {
                        backgroundColor,
                        color: !editable ? disabledColor : textColor,
                        borderColor: !editable
                            ? disabledColor
                            : variant === "fill"
                              ? backgroundColor
                              : borderColor,
                        borderWidth: !editable || variant !== "fill" ? 1 : 0,
                        fontSize,
                        paddingVertical: paddingV + 4,
                        paddingHorizontal: 8,
                    },
                ]}
                multiline
                editable={editable}
                selectTextOnFocus={autoSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};
