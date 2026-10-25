import { FC } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Svg, { Polygon, Polyline } from "react-native-svg";
import {
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    getNotchedPanelGeometry,
    NotchedPanelProps,
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
        minWidth: 80,
    },
    header: {
        minHeight: 38,
        paddingTop: 9,
        paddingRight: 32,
        paddingBottom: 11,
        paddingLeft: 18,
    },
});

interface Props extends Omit<PressableProps, "children" | "style"> {
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}

export const NotchedPanel: FC<NotchedPanelProps & Props> = ({
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
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
    header,
    children,
    style,
    contentStyle,
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
    const { width, height, headerHeight } = dimensions;
    const { bodyPoints, headerPoints, stepPoints } = getNotchedPanelGeometry(
        width,
        height,
        headerHeight,
    );
    const hasHeader =
        header !== undefined &&
        header !== null &&
        header !== false &&
        header !== "";
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
                            points={bodyPoints}
                            color={appearance.effects.glowColor}
                            strokeWidth={2}
                        />
                    ) : null}
                    <Polygon
                        points={bodyPoints}
                        fill={appearance.surface}
                        stroke={appearance.border.color}
                        strokeWidth={appearance.border.width}
                    />
                    <Polyline
                        points={stepPoints}
                        fill="none"
                        stroke={appearance.border.color}
                        strokeWidth={appearance.border.width}
                    />
                    {hasHeader ? (
                        <Polyline
                            points={headerPoints}
                            fill="none"
                            stroke={appearance.border.color}
                            strokeWidth={appearance.border.width}
                        />
                    ) : null}
                </Svg>
            ) : null}
            {hasHeader ? (
                <View
                    onLayout={dimensions.onHeaderLayout}
                    style={styles.header}
                >
                    <HudContent appearance={appearance}>{header}</HudContent>
                </View>
            ) : null}
            <View style={contentStyle}>
                <HudContent appearance={appearance}>{children}</HudContent>
            </View>
        </>
    );

    return interactive || onPress ? (
        <Pressable
            {...props}
            {...interaction}
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
            onLayout={handleLayout}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ ...accessibilityState, disabled }}
            style={panelStyle}
        >
            {content}
        </View>
    );
};
