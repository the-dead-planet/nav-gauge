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

    return (
        <View style={styles.container}>
            <Button
                icon={Icons.NounProject.Minus}
                color={color}
                size={size}
                disabled={disabled || !onChange || (min !== undefined && decrement < min)}
                onPress={() => onChange?.(decrement)}
                accessibilityLabel={ariaLabel ? `${ariaLabel} (−)` : '−'}
                style={{ height: controlHeights[size] }}
            />
            <View style={styles.control}>{children}</View>
            <Button
                icon={Icons.NounProject.Plus}
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
