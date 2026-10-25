import { FC, Ref } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewInstance,
    ViewStyle,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import {
    BevelPanelProps,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    getBevelPanelGeometry,
    useTheme,
} from "@ui";
import { resolveElevationStyle } from "../../design-system/theme";
import { HudContent } from "../HudContent";
import { HudGlow } from "../HudGlow";
import { useHudInteraction } from "../useHudInteraction";
import { usePanelDimensions } from "../usePanelDimensions";

const styles = StyleSheet.create({
    panel: {
        position: "relative",
    },
    content: {
        position: "relative",
    },
});

interface Props extends Omit<PressableProps, "children" | "style"> {
    forwardRef?: Ref<ViewInstance>;
    style?: StyleProp<ViewStyle>;
}

export const BevelPanel: FC<BevelPanelProps & Props> = ({
    forwardRef,
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    size = DEFAULT_SIZE,
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
    onLayout,
    accessibilityRole,
    accessibilityState,
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
    const dimensions = usePanelDimensions();
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor ?? color,
        state,
    );
    const { width, height } = dimensions;
    const { points } = getBevelPanelGeometry(width, height, size);
    const showGlow =
        activeGlow !== "none" &&
        (state === "active-pressed" || state === "hover-focus");
    const panelStyle = [
        styles.panel,
        resolveElevationStyle(theme, "raised", "down"),
        style,
    ];
    const handleLayout: NonNullable<PressableProps["onLayout"]> = (event) => {
        dimensions.onLayout(event);
        onLayout?.(event);
    };
    const content = (
        <>
            {width > 0 && height > 0 ? (
                <Svg
                    viewBox={`0 0 ${width} ${height}`}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    {showGlow ? (
                        <HudGlow
                            points={points}
                            color={appearance.effects.glowColor}
                            strokeWidth={2}
                        />
                    ) : null}
                    <Polygon
                        points={points}
                        fill={appearance.surface}
                        stroke={appearance.border.color}
                        strokeWidth={appearance.border.width}
                    />
                </Svg>
            ) : null}
            <View style={styles.content}>
                <HudContent appearance={appearance}>{children}</HudContent>
            </View>
        </>
    );

    return interactive || onPress ? (
        <Pressable
            {...props}
            {...interaction}
            ref={forwardRef}
            disabled={disabled}
            onPress={onPress}
            onLayout={handleLayout}
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
            ref={forwardRef}
            onLayout={handleLayout}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ ...accessibilityState, disabled }}
            style={panelStyle}
        >
            {content}
        </View>
    );
};
