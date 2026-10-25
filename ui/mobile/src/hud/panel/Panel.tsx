import { FC } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_ELEVATION,
    DEFAULT_FILL_VARIANT,
    PanelProps,
    useTheme,
} from "@ui";
import {
    resolveElevationStyle,
    resolveLayerStyle,
} from "../../design-system/theme";
import { HudContent } from "../HudContent";
import { useHudInteraction } from "../useHudInteraction";

const styles = StyleSheet.create({
    panel: {
        position: "relative",
    },
});

interface Props extends Omit<PressableProps, "children" | "style"> {
    style?: StyleProp<ViewStyle>;
}

export const Panel: FC<PanelProps & Props> = ({
    shape: _shape,
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    borderWidth,
    elevation = DEFAULT_ELEVATION,
    elevationLayer,
    interactive = false,
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
}) => {
    const theme = useTheme();
    const { state, interaction } = useHudInteraction({
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
        highlightColor ?? color,
        state,
    );
    const showGlow =
        activeGlow !== "none" &&
        (state === "active-pressed" || state === "hover-focus");
    const panelStyle: StyleProp<ViewStyle> = [
        styles.panel,
        elevationLayer
            ? resolveLayerStyle(theme, elevationLayer, "down")
            : resolveElevationStyle(theme, elevation, "down"),
        {
            backgroundColor: appearance.surface,
            borderColor: appearance.border.color,
            borderWidth:
                appearance.border.width * Math.max(0, borderWidth ?? 1),
            boxShadow: showGlow
                ? `0 0 4px ${appearance.effects.glowColor}, 0 0 20px ${appearance.effects.glowColor}`
                : undefined,
        },
        style,
    ];
    const content = <HudContent appearance={appearance}>{children}</HudContent>;

    return interactive || onPress ? (
        <Pressable
            {...props}
            {...interaction}
            disabled={disabled}
            onPress={onPress}
            accessibilityRole={
                accessibilityRole ?? (onPress ? "button" : undefined)
            }
            accessibilityState={{ ...accessibilityState, disabled }}
            style={panelStyle}
        >
            {content}
        </Pressable>
    ) : (
        <View
            {...props}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ ...accessibilityState, disabled }}
            style={panelStyle}
        >
            {content}
        </View>
    );
};
