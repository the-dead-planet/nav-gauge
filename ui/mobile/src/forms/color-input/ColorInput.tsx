import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { ColorInputProps, parseColor, toCssColor, useTheme } from "@ui";
import { Text } from "../../typography";
import { ColorButton } from "../color-button";

export const ColorInput: FC<ColorInputProps> = ({
    color = 'neutral',
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    disabled = false,
}) => {
    const theme = useTheme();
    const borderColor = theme.color(color, 500);
    const inverseBackgroundColor = theme.color(color, theme.isLight ? 100 : 900);
    const backgroundColor = variant === 'fill'
        ? borderColor
        : variant === 'fill-translucent'
            ? toCssColor({ ...parseColor(borderColor), a: .24 })
            : inverseBackgroundColor;
    const textColor = variant === 'fill'
        ? inverseBackgroundColor
        : borderColor;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontSize: size === 'xs' ? 11 : 12 }]}>{label}</Text>
            <View
                style={[
                    styles.wrapper,
                    {
                        backgroundColor,
                        borderColor,
                        opacity: disabled ? .4 : 1,
                    },
                ]}
            >
                <ColorButton
                    value={value}
                    label={label}
                    size={size}
                    disabled={disabled}
                />
                <Text style={[styles.hexValue, { color: textColor }]}>{value}</Text>
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
        borderRadius: 0,
        gap: 8,
        padding: 4,
    },
    hexValue: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
});
