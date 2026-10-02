import { forwardRef } from "react";
import { HostInstance, Pressable, PressableProps, StyleSheet } from "react-native";
import { ColorButtonProps, formatColorDescription, useTheme } from "@ui";

const styles = StyleSheet.create({
    button: {
        flexShrink: 0,
        padding: 0,
        borderWidth: 1,
        borderRadius: 0,
    },
    selected: {
        borderWidth: 3,
    },
    disabled: {
        opacity: .5,
    },
});

export const ColorButton = forwardRef<HostInstance, ColorButtonProps & Omit<PressableProps, 'children' | 'style'>>(({
    value,
    label = 'Color',
    size = 'sm',
    selected = false,
    disabled = false,
    onPress,
    ...props
}, ref) => {
    const theme = useTheme();
    const buttonSize = size === 'xs' ? 18 : size === 'sm' ? 22 : 26;
    const description = formatColorDescription(label, value);

    return (
        <Pressable
            ref={ref}
            style={[
                styles.button,
                {
                    width: buttonSize,
                    height: buttonSize,
                    backgroundColor: value,
                    borderColor: selected ? theme.color('primary', 500) : theme.componentColor('border'),
                },
                selected && styles.selected,
                disabled && styles.disabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={description}
            accessibilityState={{ disabled, selected }}
            disabled={disabled}
            onPress={onPress}
            {...props}
        />
    );
});

ColorButton.displayName = 'ColorButton';
