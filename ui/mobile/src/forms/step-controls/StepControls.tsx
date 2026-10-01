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
                accessibilityLabel="Decrease"
            />
            <View style={styles.control}>{children}</View>
            <Button
                icon={Icons.NounProject.Plus}
                color={color}
                size={size}
                disabled={disabled || !onChange || (max !== undefined && increment > max)}
                onPress={() => onChange?.(increment)}
                accessibilityLabel="Increase"
            />
        </View>
    );
};
