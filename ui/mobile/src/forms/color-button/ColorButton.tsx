import { forwardRef } from "react";
import {
    HostInstance,
    Pressable,
    PressableProps,
    StyleSheet,
} from "react-native";
import {
    ColorButtonProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    formatColorDescription,
    useTheme,
} from "@ui";
import { DisabledRampPattern } from "../color-ramp/DisabledRampPattern";
import { useHudInteraction } from "../../hud/useHudInteraction";

const styles = StyleSheet.create({
    button: {
        flexShrink: 0,
        padding: 0,
        borderRadius: 0,
    },
    disabled: {
        overflow: "hidden",
    },
});

export const ColorButton = forwardRef<
    HostInstance,
    ColorButtonProps & Omit<PressableProps, "children" | "style">
>(
    (
        {
            value,
            label = "Color",
            size = DEFAULT_SIZE,
            selected = false,
            disabled = false,
            onPress,
            onPressIn,
            onPressOut,
            onHoverIn,
            onHoverOut,
            onFocus,
            onBlur,
            accessibilityState,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const buttonSize = theme.sizes.control[size].height;
        const { state, interaction, focused } = useHudInteraction({
            disabled,
            highlighted: selected,
            onPressIn,
            onPressOut,
            onHoverIn,
            onHoverOut,
            onFocus,
            onBlur,
        });
        const appearance = theme.resolveAppearance(
            "default",
            DEFAULT_COLOR,
            DEFAULT_COLOR,
            state,
        );
        const description = formatColorDescription(label, value);

        return (
            <Pressable
                {...props}
                {...interaction}
                ref={ref}
                style={[
                    styles.button,
                    {
                        width: buttonSize,
                        height: buttonSize,
                        borderWidth: appearance.border.width,
                        backgroundColor: value,
                        borderColor: appearance.border.color,
                        outlineStyle: "solid",
                        outlineWidth:
                            focused || state === "active-pressed" ? 2 : 0,
                        outlineOffset: focused ? 3 : 1,
                        outlineColor: focused
                            ? appearance.effects.glowColor
                            : appearance.glyphs,
                    },
                    disabled && styles.disabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={props.accessibilityLabel ?? description}
                accessibilityState={{
                    ...accessibilityState,
                    disabled,
                    selected,
                }}
                disabled={disabled}
                onPress={onPress}
            >
                {disabled ? <DisabledRampPattern /> : null}
            </Pressable>
        );
    },
);

ColorButton.displayName = "ColorButton";
