import { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { controlTextSpecifications, NumberInputProps, useTheme } from "@ui";
import { Text } from "../../typography";

const sizes = {
    md: { height: 32, paddingHorizontal: 12, fontSize: controlTextSpecifications.md.fontSize },
    sm: { height: 24, paddingHorizontal: 10, fontSize: controlTextSpecifications.sm.fontSize },
    xs: { height: 18, paddingHorizontal: 8, fontSize: controlTextSpecifications.xs.fontSize },
} as const;

export const NumberInput: FC<NumberInputProps> = ({
    color = 'neutral',
    size = 'sm',
    label,
    value,
    onChange,
    disabled = false,
    ariaLabel,
    unit,
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
    const inputSize = sizes[size];

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: baseColor, fontSize: labelFontSize }]}>{label}</Text> : null}
            <View style={styles['input-wrapper']}>
                <TextInput
                    style={[
                        styles.input,
                        unit && styles['input-with-unit'],
                        {
                            color: baseColor,
                            borderColor: baseColor,
                            ...inputSize,
                            paddingVertical: 0,
                        },
                    ]}
                    value={String(value)}
                    onChangeText={handleChange}
                    keyboardType="decimal-pad"
                    accessibilityLabel={ariaLabel || (typeof label === 'string' ? label : undefined)}
                    editable={!disabled}
                />
                {unit ? <Text style={[styles.unit, { color: baseColor, fontSize: inputSize.fontSize }]}>{unit}</Text> : null}
            </View>
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
    'input-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        boxSizing: 'border-box',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 14,
    },
    'input-with-unit': {
        flex: 1,
    },
    unit: {
        fontSize: 14,
        marginLeft: 4,
        opacity: 0.6,
    },
});
