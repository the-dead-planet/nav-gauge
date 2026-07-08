import { FC } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ColorInputProps, useTheme } from "@ui";
import { Text } from "../../typography";

export const ColorInput: FC<ColorInputProps> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    label,
    value,
    onChange,
    disabled = false,
}) => {
    const theme = useTheme();
    const borderColor = theme.color(color, 500);
    const swatchSize = size === 'xs' ? 18 : size === 'sm' ? 22 : 26;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontSize: size === 'xs' ? 11 : 12 }]}>{label}</Text>
            <View
                style={[
                    styles.wrapper,
                    {
                        backgroundColor: theme.color(color, theme.isLight ? 100 : 900),
                        borderColor,
                        opacity: disabled ? .4 : 1,
                    },
                ]}
            >
                <TouchableOpacity
                    style={[styles.swatch, { width: swatchSize, height: swatchSize, backgroundColor: value }]}
                    onPress={() => onChange(value)}
                    disabled={disabled}
                    activeOpacity={.7}
                />
                <Text style={[styles.hexValue, { color: theme.color(highlightColor, theme.isLight ? 600 : 300) }]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        gap: 8,
        padding: 4,
    },
    swatch: {
        borderRadius: 2,
    },
    hexValue: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
});
