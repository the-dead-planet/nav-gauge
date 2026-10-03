import { forwardRef } from "react";
import { HostInstance, Pressable, PressableProps, StyleSheet, View } from "react-native";
import { ColorButtonProps, formatColorDescription, useTheme } from "@ui";

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
    stripe: {
        position: 'absolute',
        left: '-25%',
        width: '150%',
        height: 2,
        transform: [{ rotate: '-45deg' }],
        pointerEvents: 'none',
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
    const buttonSize = size === 'xs' ? 18 : size === 'sm' ? 24 : 32;
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
            {disabled ? [20, 50, 80].map((top) => (
                <View
                    key={top}
                    style={[
                        styles.stripe,
                        {
                            top: `${top}%`,
                            backgroundColor: theme.color('neutral', theme.isDark ? 300 : 700),
                        },
                    ]}
                />
            )) : null}
        </Pressable>
    );
});

ColorButton.displayName = 'ColorButton';
