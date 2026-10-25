import { forwardRef, useId } from "react";
import {
    View,
    StyleSheet,
    Pressable,
    PressableProps,
    ViewInstance,
} from "react-native";
import Svg, {
    Polygon,
    Polyline,
    Defs,
    ClipPath,
    RadialGradient,
    Stop,
} from "react-native-svg";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    hexagonGeometry,
    HexagonProps,
    useTheme,
} from "@ui";
import { HudContent } from "../HudContent";
import { HudGlow } from "../HudGlow";
import { useHudInteraction } from "../useHudInteraction";

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
});

type Props = Omit<PressableProps, "children">;

export const Hexagon = forwardRef<ViewInstance, HexagonProps & Props>(
    (
        {
            shape = "pointy-top",
            strokeWidth,
            color = DEFAULT_COLOR,
            highlightColor,
            variant = DEFAULT_SURFACE_VARIANT,
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
            accessibilityState,
            accessibilityRole,
            style,
            children,
            ...props
        },
        ref,
    ) => {
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
        const { points, viewBox, aspectRatio, shadowPoints, highlightPoints } =
            hexagonGeometry[shape];
        const clipPathId = useId();
        const recessGradientId = useId();
        const containerStyle = [
            styles.container,
            { aspectRatio, height: theme.sizes.control[size].height },
        ];
        const content = (
            <>
                <Svg
                    viewBox={viewBox}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    {showGlow ? (
                        <HudGlow
                            points={points}
                            color={appearance.effects.glowColor}
                            strokeWidth={strokeWidth ?? 1}
                        />
                    ) : null}
                    <Polygon
                        points={points}
                        fill={appearance.surface}
                        stroke={appearance.border.color}
                        strokeWidth={
                            appearance.border.width *
                            Math.max(0, strokeWidth ?? 1)
                        }
                        vectorEffect="non-scaling-stroke"
                    />
                    {appearance.effects.depth === "inset" ? (
                        <>
                            <Defs>
                                <ClipPath id={clipPathId}>
                                    <Polygon points={points} />
                                </ClipPath>
                                <RadialGradient id={recessGradientId}>
                                    <Stop
                                        offset="0"
                                        stopColor={
                                            appearance.effects.inset.recess
                                        }
                                    />
                                    <Stop
                                        offset=".65"
                                        stopColor={
                                            appearance.effects.inset.recess
                                        }
                                    />
                                    <Stop
                                        offset="1"
                                        stopColor={
                                            appearance.effects.inset.recess
                                        }
                                        stopOpacity={0}
                                    />
                                </RadialGradient>
                            </Defs>
                            <Polygon
                                points={points}
                                fill={`url(#${recessGradientId})`}
                            />
                            <Polyline
                                points={shadowPoints}
                                fill="none"
                                stroke={appearance.effects.inset.shadow}
                                strokeWidth={10}
                                strokeOpacity={0.28}
                                clipPath={`url(#${clipPathId})`}
                            />
                            <Polyline
                                points={highlightPoints}
                                fill="none"
                                stroke={appearance.effects.inset.highlight}
                                strokeWidth={10}
                                strokeOpacity={0.28}
                                clipPath={`url(#${clipPathId})`}
                            />
                            <Polyline
                                points={shadowPoints}
                                fill="none"
                                stroke={appearance.effects.inset.shadow}
                                strokeWidth={3}
                                clipPath={`url(#${clipPathId})`}
                            />
                            <Polyline
                                points={highlightPoints}
                                fill="none"
                                stroke={appearance.effects.inset.highlight}
                                strokeWidth={3}
                                clipPath={`url(#${clipPathId})`}
                            />
                        </>
                    ) : null}
                </Svg>
                <View style={styles.content}>
                    <HudContent appearance={appearance}>{children}</HudContent>
                </View>
            </>
        );

        return interactive || onPress ? (
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
                    ...containerStyle,
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
                    ...containerStyle,
                    typeof style === "function" ? undefined : style,
                ]}
            >
                {content}
            </View>
        );
    },
);
