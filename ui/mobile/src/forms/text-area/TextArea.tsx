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
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = "sm",
    variant = "fill-inverse",
    label,
    autoSelect = false,
    editable = true,
    active = false,
    disabled = false,
    ...props
}) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const isDisabled = disabled || !editable;
    const highlighted = !isDisabled && (active || isFocused);
    const borderColor = highlighted
        ? theme.color(highlightColor, theme.isLight ? 600 : 300)
        : theme.color(color, 500, variant === "fill-translucent" ? 0.3 : 1);
    const fontSize = controlTextSpecifications[size].fontSize;
    const paddingV = size === "xs" ? 0 : size === "sm" ? 2 : 6;
    const disabledColor = theme.color(color, theme.isLight ? 300 : 700);
    const textColor = highlighted && highlightContentShade !== undefined
        ? theme.color(highlightColor, highlightContentShade)
        : contentShade !== undefined
          ? theme.color(color, contentShade)
          :
        variant === "fill"
            ? theme.color(color, theme.contrastShade(color))
            : theme.color(color, theme.isLight ? 900 : 100);
    const backgroundColor = isDisabled
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
                shade={contentShade}
                disabled={isDisabled}
                style={[styles.label, { fontSize: size === "xs" ? 11 : 12 }]}
            >
                {label}
            </Label>
            <RNTextInput
                style={[
                    styles.textarea,
                    {
                        backgroundColor,
                        color: isDisabled ? disabledColor : textColor,
                        borderColor: isDisabled
                            ? disabledColor
                            : variant === "fill"
                              ? backgroundColor
                              : borderColor,
                        borderWidth: isDisabled || variant !== "fill" ? 1 : 0,
                        fontSize,
                        paddingVertical: paddingV + 4,
                        paddingHorizontal: 8,
                    },
                ]}
                multiline
                editable={!isDisabled}
                accessibilityState={{ ...props.accessibilityState, disabled: isDisabled }}
                selectTextOnFocus={autoSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};
