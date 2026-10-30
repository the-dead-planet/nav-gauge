import { forwardRef } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewInstance,
    ViewStyle,
} from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    OctagonProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { useHudInteraction } from "../useHudInteraction";
import { OctagonalSurface } from "../octagonal-panel/OctagonalSurface";
import { HudContent } from "../HudContent";

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1,
    },
    content: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
});

export const Octagon = forwardRef<
    ViewInstance,
    OctagonProps & Omit<PressableProps, "children">
>(
    (
        {
            themeMode,
            color = DEFAULT_COLOR,
            highlightColor = color,
            variant = DEFAULT_SURFACE_VARIANT,
            size = DEFAULT_SIZE,
            strokeWidth,
            interactive = false,
            activeGlow = "none",
            highlighted = false,
            disabled = false,
            onPress,
            onPressIn,
            onPressOut,
            onHoverIn,
            onHoverOut,
            onFocus,
            onBlur,
            accessibilityState,
            accessibilityRole,
            style,
            children,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme().forMode(themeMode);
        const { state, interaction, focused } = useHudInteraction({
            disabled,
            highlighted,
            onPressIn,
            onPressOut,
            onHoverIn,
            onHoverOut,
            onFocus,
            onBlur,
        });
        const appearance = theme.resolveAppearance(
            variant,
            color,
            highlightColor,
            state,
        );
        const dimension = theme.sizes.control[size].height;
        const containerStyle: StyleProp<ViewStyle> = [
            styles.container,
            {
                height: dimension,
                outlineStyle: "solid",
                outlineWidth: focused ? 2 : 0,
                outlineOffset: 3,
                outlineColor: appearance.effects.glowColor,
            },
        ];
        const content = (
            <>
                <OctagonalSurface
                    width={dimension}
                    height={dimension}
                    size={size}
                    appearance={appearance}
                    strokeWidth={strokeWidth}
                    regular
                    showGlow={
                        activeGlow !== "none" &&
                        (state === "active-pressed" || state === "hover-focus")
                    }
                />
                <View style={styles.content}>
                    <HudContent appearance={appearance}>{children}</HudContent>
                </View>
            </>
        );
        const octagon =
            interactive || onPress ? (
                <Pressable
                    {...props}
                    {...interaction}
                    ref={ref}
                    disabled={disabled}
                    onPress={onPress}
                    accessibilityRole={
                        accessibilityRole ?? (onPress ? "button" : undefined)
                    }
                    accessibilityState={{ ...accessibilityState, disabled }}
                    style={(pressState) => [
                        containerStyle,
                        typeof style === "function" ? style(pressState) : style,
                    ]}
                >
                    {content}
                </Pressable>
            ) : (
                <View
                    {...props}
                    ref={ref}
                    accessibilityRole={accessibilityRole}
                    accessibilityState={{ ...accessibilityState, disabled }}
                    style={[
                        containerStyle,
                        typeof style === "function" ? undefined : style,
                    ]}
                >
                    {content}
                </View>
            );
        return (
            <ThemeContext.Provider value={theme}>
                {octagon}
            </ThemeContext.Provider>
        );
    },
);
