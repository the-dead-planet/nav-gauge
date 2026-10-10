import { forwardRef } from "react";
import { HostInstance, Pressable, PressableProps, StyleSheet } from "react-native";
import { ColorButtonProps, formatColorDescription, useTheme } from "@ui";
import { DisabledRampPattern } from "../color-ramp/DisabledRampPattern";

const styles = StyleSheet.create({
    button: {
        flexShrink: 0,
        padding: 0,
        borderWidth: 1,
        borderRadius: 0,
    },
    disabled: {
        overflow: 'hidden',
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
    const buttonSize = { xs: 18, sm: 24, md: 32, lg: 40 }[size];
    const description = formatColorDescription(label, value);

    return (
        <Pressable
            ref={ref}
            style={[
                styles.button,
                {
                    width: buttonSize,
                    height: buttonSize,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: value,
                    borderColor: disabled
                        ? theme.color('neutral', 500)
                        : selected
                            ? theme.color('neutral', theme.isDark ? 300 : 700)
                            : theme.color('neutral', 500),
                },
                disabled && styles.disabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={description}
            accessibilityState={{ disabled, selected }}
            disabled={disabled}
            onPress={onPress}
            {...props}
        >
            {disabled ? <DisabledRampPattern /> : null}
        </Pressable>
    );
});

ColorButton.displayName = 'ColorButton';
