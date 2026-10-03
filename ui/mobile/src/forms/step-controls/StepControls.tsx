import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { addDecimalStep, Icons, StepControlsProps } from "@ui";
import { Button } from "../../button";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    control: {
        flex: 1,
        minWidth: 0,
    },
});

const controlHeights = { xs: 18, sm: 24, md: 32 } as const;

export const StepControls: FC<StepControlsProps> = ({
    children,
    color = 'neutral',
    variant,
    size = 'sm',
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    ariaLabel,
}) => {
    const decrement = addDecimalStep(value, -step);
    const increment = addDecimalStep(value, step);
    const minusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.MinusOutlined
        : Icons.NounProject.Minus;
    const plusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.PlusOutlined
        : Icons.NounProject.Plus;

    return (
        <View style={styles.container}>
            <Button
                icon={minusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (min !== undefined && decrement < min)}
                onPress={() => onChange?.(decrement)}
                accessibilityLabel={ariaLabel ? `${ariaLabel} (−)` : '−'}
                style={{ height: controlHeights[size] }}
            />
            <View style={styles.control}>{children}</View>
            <Button
                icon={plusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (max !== undefined && increment > max)}
                onPress={() => onChange?.(increment)}
                accessibilityLabel={ariaLabel ? `${ariaLabel} (+)` : '+'}
                style={{ height: controlHeights[size] }}
            />
        </View>
    );
};
