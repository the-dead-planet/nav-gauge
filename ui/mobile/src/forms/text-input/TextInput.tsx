import { FC, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import { TextInputProps, useTheme } from "@ui";
import { Text } from "../../typography";

export const TextInput: FC<TextInputProps> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
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
        : theme.color(color, 500);
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;
    const paddingV = size === 'xs' ? 0 : size === 'sm' ? 2 : 6;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontSize: size === 'xs' ? 11 : 12 }]}>{label}</Text>
            <RNTextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.color(color, theme.isLight ? 100 : 900),
                        color: theme.color(color, theme.isLight ? 800 : 100),
                        borderColor,
                        fontSize,
                        paddingVertical: paddingV,
                        paddingHorizontal: 8,
                        opacity: disabled ? .4 : 1,
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

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        boxSizing: 'border-box',
    },
});
