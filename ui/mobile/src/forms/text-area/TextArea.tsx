import { ComponentProps, FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import { TextAreaProps, useTheme } from "@ui";
import { Text } from "../../typography";

export const TextArea: FC<TextAreaProps & ComponentProps<typeof RNTextInput>> = ({
    color = 'neutral',
    highlightColor: hlColor,
    size = 'sm',
    label,
    autoSelect = false,
    ...props
}) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const highlightColor = hlColor ?? color;
    const borderColor = isFocused
        ? theme.color(highlightColor, theme.isLight ? 600 : 300)
        : theme.color(color, 500);
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;
    const paddingV = size === 'xs' ? 0 : size === 'sm' ? 2 : 6;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontSize: size === 'xs' ? 11 : 12 }]}>{label}</Text>
            <RNTextInput
                style={[
                    styles.textarea,
                    {
                        backgroundColor: theme.color(color, theme.isLight ? 100 : 900),
                        color: theme.color(color, theme.isLight ? 800 : 100),
                        borderColor,
                        fontSize,
                        paddingVertical: paddingV + 4,
                        paddingHorizontal: 8,
                    },
                ]}
                multiline
                selectTextOnFocus={autoSelect}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
    },
    textarea: {
        borderWidth: 1,
        borderRadius: 4,
        minHeight: 60,
        textAlignVertical: 'top',
    },
});
