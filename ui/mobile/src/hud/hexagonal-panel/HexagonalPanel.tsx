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
    HexagonalPanelProps,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_HEXAGONAL_PANEL_SHAPE,
    getHexagonalPanelGeometry,
    ThemeContext,
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

export const HexagonalPanel: FC<HexagonalPanelProps & Props> = ({
    themeMode,
    forwardRef,
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    size = DEFAULT_SIZE,
    shape = DEFAULT_HEXAGONAL_PANEL_SHAPE,
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
    const dimensions = usePanelDimensions();
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor ?? color,
        state,
    );
    const { width, height } = dimensions;
    const { points } = getHexagonalPanelGeometry(width, height, size, shape);
    const showGlow =
        activeGlow !== "none" &&
        (state === "active-pressed" || state === "hover-focus");
    const panelStyle: StyleProp<ViewStyle> = [
        styles.panel,
        resolveElevationStyle(theme, "raised", "down"),
        {
            outlineStyle: "solid",
            outlineColor: appearance.effects.glowColor,
            outlineOffset: 3,
            outlineWidth: focused ? 2 : 0,
        },
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
                        vectorEffect="non-scaling-stroke"
                    />
                </Svg>
            ) : null}
            <View style={styles.content}>
                <HudContent appearance={appearance}>{children}</HudContent>
            </View>
        </>
    );

    const panel =
        interactive || onPress ? (
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
    return <ThemeContext.Provider value={theme}>{panel}</ThemeContext.Provider>;
};
