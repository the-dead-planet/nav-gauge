import { FC } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NumberInputProps, useTheme } from "@ui";

export const NumberInput: FC<NumberInputProps> = ({
    color = 'neutral',
    size = 'sm',
    label,
    value,
    onChange,
    disabled = false,
}) => {
    const theme = useTheme();

    const handleChange = (text: string) => {
        const parsed = Number(text);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const baseColor = theme.color(color, 500);
    const labelFontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 13;
    const inputFontSize = size === 'xs' ? 12 : size === 'sm' ? 14 : 16;
    const padding = size === 'xs' ? 4 : size === 'sm' ? 6 : 8;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: baseColor, fontSize: labelFontSize }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        color: baseColor,
                        borderColor: baseColor,
                        fontSize: inputFontSize,
                        padding,
                    },
                ]}
                value={String(value)}
                onChangeText={handleChange}
                keyboardType="numeric"
                editable={!disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
        fontSize: 12,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 14,
    },
});
