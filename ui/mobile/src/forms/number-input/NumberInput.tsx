import { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { ColorShade, controlTextSpecifications, FontType, Icons, NumberInputProps, SizeVariant, useStepRepeat, useTheme } from "@ui";
import { Button } from "../../button";
import { Text } from "../../typography";
import { getMobileFontFamily } from "../../typography/fontFamily";
import { TRANSLUCENT_OPACITY } from "../../tinkers";

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
        marginRight: 4,
    },
    steppers: {
        flexShrink: 0,
        borderLeftWidth: 1,
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
    lg: { height: 40, paddingHorizontal: 14, fontSize: 16 },
    md: { height: 32, paddingHorizontal: 12, fontSize: controlTextSpecifications.md.fontSize },
    sm: { height: 24, paddingHorizontal: 10, fontSize: controlTextSpecifications.sm.fontSize },
    xs: { height: 18, paddingHorizontal: 8, fontSize: controlTextSpecifications.xs.fontSize },
} as const;

const buttonSizes: Record<SizeVariant, SizeVariant> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
};

export const NumberInput: FC<NumberInputProps> = ({
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    active = false,
    ariaLabel,
    unit,
    min,
    max,
    step,
    autoSelect = false,
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
    const resolvedContentShade: ColorShade = contentShade ?? (variant === 'fill-translucent'
        ? 500
        : variant === 'fill'
            ? theme.isLight ? 100 : 900
            : theme.isLight ? 900 : 100);
    const contentColor = theme.color(active ? highlightColor : color, active ? highlightContentShade ?? resolvedContentShade : resolvedContentShade);
    const disabledShade: ColorShade = theme.isLight ? 300 : 700;
    const disabledColor = theme.color(color, disabledShade);
    const activeAccent = theme.color(highlightColor, theme.isLight ? 600 : 300);
    const backgroundColor = active && !disabled && variant === 'fill'
        ? activeAccent
        : variant === 'fill'
        ? baseColor
        : variant === 'fill-translucent'
            ? theme.color(color, 500, TRANSLUCENT_OPACITY)
            : theme.color(color, theme.isLight ? 100 : 900);
    const borderColor = active && !disabled
        ? activeAccent
        : variant === 'fill-translucent'
        ? theme.color(color, 500, 0.3)
        : baseColor;
    const labelFontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 13;
    const inputSize = sizes[size];
    const stepRepeat = useStepRepeat({ value, onChange, step, min, max, disabled });
    const incrementDisabled = disabled || (max !== undefined && value >= max);
    const decrementDisabled = disabled || (min !== undefined && value <= min);

    const input = (
        <View
            style={[
                styles['input-wrapper'],
                { borderColor, backgroundColor, height: inputSize.height },
            ]}
        >
            <TextInput
                style={[
                    styles.input,
                    unit && styles['input-with-unit'],
                    {
                        color: disabled ? disabledColor : contentColor,
                        ...inputSize,
                        height: '100%',
                        paddingVertical: 0,
                    },
                ]}
                value={String(value)}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                selectTextOnFocus={autoSelect}
                accessibilityLabel={ariaLabel || (typeof label === 'string' ? label : undefined)}
                editable={!disabled}
            />
            {unit ? (
                <Text
                    style={[
                        styles.unit,
                        { color: disabled ? disabledColor : contentColor, fontSize: inputSize.fontSize },
                    ]}
                >
                    {unit}
                </Text>
            ) : null}
            {showStepControls ? (
                <View style={[styles.steppers, { borderLeftColor: borderColor }]}>
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        iconRotateZ={180}
                        color={color}
                        highlightColor={highlightColor}
                        highlightContentShade={highlightContentShade}
                        contentShade={incrementDisabled ? disabledShade : contentShade}
                        size={buttonSizes[size]}
                        disabled={incrementDisabled}
                        active={active}
                        onPressIn={() => stepRepeat.start(1)}
                        onPressOut={stepRepeat.stop}
                        accessibilityLabel={ariaLabel ? `${ariaLabel} (+)` : '+'}
                        style={[styles.stepper, incrementDisabled && { opacity: 1 }]}
                    />
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        color={color}
                        highlightColor={highlightColor}
                        highlightContentShade={highlightContentShade}
                        contentShade={decrementDisabled ? disabledShade : contentShade}
                        size={buttonSizes[size]}
                        disabled={decrementDisabled}
                        active={active}
                        onPressIn={() => stepRepeat.start(-1)}
                        onPressOut={stepRepeat.stop}
                        accessibilityLabel={ariaLabel ? `${ariaLabel} (−)` : '−'}
                        style={[
                            styles.stepper,
                            decrementDisabled && { opacity: 1 },
                            { borderTopWidth: 1, borderTopColor: borderColor },
                        ]}
                    />
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={styles.container}>
            {label ? (
                <Text
                    style={[
                        styles.label,
                        { color: disabled ? disabledColor : baseColor, fontSize: labelFontSize },
                    ]}
                >
                    {label}
                </Text>
            ) : null}
            {input}
        </View>
    );
};
