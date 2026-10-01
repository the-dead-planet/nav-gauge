import { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { addDecimalStep, controlTextSpecifications, FontType, Icons, NumberInputProps, SizeVariant, useTheme } from "@ui";
import { Button } from "../../button";
import { Text } from "../../typography";
import { getMobileFontFamily } from "../../typography/fontFamily";

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
        fontSize: 12,
    },
    'input-wrapper': {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderWidth: 1,
        borderRadius: 0,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        boxSizing: 'border-box',
        borderWidth: 0,
        borderRadius: 0,
        fontSize: 14,
        fontFamily: getMobileFontFamily(FontType.Numeric),
        fontVariant: ['tabular-nums'],
    },
    'input-with-unit': {
        flex: 1,
    },
    unit: {
        alignSelf: 'center',
        fontSize: 14,
        marginLeft: 4,
        opacity: 0.6,
    },
    steppers: {
        flexShrink: 0,
    },
    stepper: {
        flex: 1,
        minHeight: 0,
        paddingHorizontal: 2,
        paddingVertical: 0,
        borderRadius: 0,
    },
});

const sizes = {
    md: { height: 32, paddingHorizontal: 12, fontSize: controlTextSpecifications.md.fontSize },
    sm: { height: 24, paddingHorizontal: 10, fontSize: controlTextSpecifications.sm.fontSize },
    xs: { height: 18, paddingHorizontal: 8, fontSize: controlTextSpecifications.xs.fontSize },
} as const;

const buttonSizes: Record<SizeVariant, SizeVariant> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
};

export const NumberInput: FC<NumberInputProps> = ({
    color = 'neutral',
    size = 'sm',
    label,
    value,
    onChange,
    disabled = false,
    ariaLabel,
    unit,
    min,
    max,
    step,
    showStepControls = true,
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
    const increment = addDecimalStep(value, step ?? 1);
    const decrement = addDecimalStep(value, -(step ?? 1));

    const input = (
        <View
            style={[
                styles['input-wrapper'],
                { borderColor: baseColor, height: inputSize.height },
            ]}
        >
            <TextInput
                style={[
                    styles.input,
                    unit && styles['input-with-unit'],
                    {
                        color: baseColor,
                        ...inputSize,
                        height: '100%',
                        paddingVertical: 0,
                    },
                ]}
                value={String(value)}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                accessibilityLabel={ariaLabel || (typeof label === 'string' ? label : undefined)}
                editable={!disabled}
            />
            {unit ? (
                <Text style={[styles.unit, { color: baseColor, fontSize: inputSize.fontSize }]}>
                    {unit}
                </Text>
            ) : null}
            {showStepControls ? (
                <View style={styles.steppers}>
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        iconRotateZ={180}
                        color={color}
                        size={buttonSizes[size]}
                        disabled={disabled || (max !== undefined && increment > max)}
                        onPress={() => onChange(increment)}
                        accessibilityLabel={ariaLabel ? `${ariaLabel} (+)` : '+'}
                        style={styles.stepper}
                    />
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        color={color}
                        size={buttonSizes[size]}
                        disabled={disabled || (min !== undefined && decrement < min)}
                        onPress={() => onChange(decrement)}
                        accessibilityLabel={ariaLabel ? `${ariaLabel} (−)` : '−'}
                        style={[
                            styles.stepper,
                            { borderTopWidth: 1, borderTopColor: baseColor },
                        ]}
                    />
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={styles.container}>
            {label ? (
                <Text style={[styles.label, { color: baseColor, fontSize: labelFontSize }]}>
                    {label}
                </Text>
            ) : null}
            {input}
        </View>
    );
};
