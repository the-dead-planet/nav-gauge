import { FC, forwardRef, useId, useState } from "react";
import {
    View,
    StyleSheet,
    Pressable,
    PressableProps,
    type ViewInstance,
} from "react-native";
import Svg, {
    Polygon,
    Defs,
    ClipPath,
    G,
    LinearGradient,
    Stop,
} from "react-native-svg";
import { DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT, HexagonProps, useTheme } from "@ui";

const POINTY_TOP = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";
const FLAT_TOP = "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7";

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

const GlowPolygons: FC<{
    points: string;
    glowColor: string;
    strokeWidth: number;
}> = ({ points, glowColor, strokeWidth }) => (
    <>
        <Polygon
            points={points}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth + 12}
            strokeOpacity={0.08}
        />
        <Polygon
            points={points}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth + 6}
            strokeOpacity={0.15}
        />
        <Polygon
            points={points}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth + 2}
            strokeOpacity={0.3}
        />
    </>
);

type Props = Omit<PressableProps, "children">;

export const Hexagon = forwardRef<ViewInstance, HexagonProps & Props>(
    (
        {
            shape = "pointy-top",
            strokeWidth = 2,
            color = "neutral",
            highlightColor = color,
            variant = DEFAULT_SURFACE_VARIANT,
            activeGlow = "none",
            size = DEFAULT_SIZE,
            interactive = false,
            highlighted = false,
            disabled = false,
            onPress,
            onLongPress,
            onPressIn: onParentPressIn,
            onPressOut: onParentPressOut,
            style,
            children,
            ...pressableProps
        },
        ref,
    ) => {
        const theme = useTheme();
        const [pressed, setPressed] = useState(false);
        const [glowDrawn, setGlowDrawn] = useState(false);
        const isActiveState = !disabled && (pressed || highlighted);
        const isPointy = shape === "pointy-top";
        const points = isPointy ? POINTY_TOP : FLAT_TOP;
        const aspectRatio = isPointy ? 86.6 / 100 : 100 / 86.6;
        const clipPathId = useId();

        const appearance = theme.resolveAppearance(
            variant,
            color,
            highlightColor,
            disabled ? "disabled" : isActiveState ? "active-pressed" : "default",
        );
        const showGlow =
            !disabled && activeGlow !== "none" && (isActiveState || glowDrawn);

        const markGlowDrawn = () => {
            if (activeGlow !== "none") {
                setGlowDrawn(true);
            }
        };

        const renderGlow = () => {
            if (!showGlow) {
                return null;
            }
            return (
                <GlowPolygons
                    points={points}
                    glowColor={appearance.effects.glowColor}
                    strokeWidth={strokeWidth}
                />
            );
        };

        const renderVariant = () => {
            if (appearance.effects.depth === "inset") {
                return (
                    <>
                            <Defs>
                                <ClipPath id={clipPathId}>
                                    <Polygon points={points} />
                                </ClipPath>
                                <LinearGradient
                                    id="shadowGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <Stop
                                        offset="0%"
                                        stopColor={appearance.effects.inset.shadow}
                                        stopOpacity={appearance.effects.inset.shadowOpacity}
                                    />
                                    <Stop
                                        offset="15%"
                                        stopColor={appearance.effects.inset.shadow}
                                        stopOpacity={0}
                                    />
                                    <Stop
                                        offset="100%"
                                        stopColor={appearance.effects.inset.shadow}
                                        stopOpacity={0}
                                    />
                                </LinearGradient>
                                <LinearGradient
                                    id="highlightGrad"
                                    x1="100%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                >
                                    <Stop
                                        offset="0%"
                                        stopColor={appearance.effects.inset.highlight}
                                        stopOpacity={appearance.effects.inset.highlightOpacity}
                                    />
                                    <Stop
                                        offset="15%"
                                        stopColor={appearance.effects.inset.highlight}
                                        stopOpacity={0}
                                    />
                                    <Stop
                                        offset="100%"
                                        stopColor={appearance.effects.inset.highlight}
                                        stopOpacity={0}
                                    />
                                </LinearGradient>
                            </Defs>
                            <G clipPath={`url(#${clipPathId})`}>
                                <Polygon points={points} fill={appearance.surface} />
                                {renderGlow()}
                                <Polygon
                                    points={points}
                                    fill="url(#shadowGrad)"
                                />
                                <Polygon
                                    points={points}
                                    fill="url(#highlightGrad)"
                                />
                            </G>
                            <Polygon
                                points={points}
                                fill="none"
                                stroke={appearance.border.color}
                                strokeWidth={appearance.border.width ? strokeWidth : 0}
                            />
                    </>
                );
            }

            return (
                <>
                    {renderGlow()}
                    <Polygon
                        points={points}
                        fill={appearance.surface}
                        stroke={appearance.border.color}
                        strokeWidth={appearance.border.width ? strokeWidth : 0}
                    />
                </>
            );
        };

        const contentElement = (
            <>
                <Svg
                    viewBox={isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6"}
                    style={StyleSheet.absoluteFill}
                >
                    {renderVariant()}
                </Svg>
                <View style={styles.content}>{children}</View>
            </>
        );
        const containerStyle = [
            styles.container,
            { aspectRatio },
            size ? { height: theme.sizes.control[size].height } : undefined,
        ];

        if (interactive) {
            return (
                <Pressable
                    ref={ref}
                    {...pressableProps}
                    disabled={disabled}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    onPressIn={(e) => {
                        setPressed(true);
                        markGlowDrawn();
                        onParentPressIn?.(e);
                    }}
                    onPressOut={(e) => {
                        setPressed(false);
                        setGlowDrawn(false);
                        onParentPressOut?.(e);
                    }}
                    style={style}
                >
                    <View style={containerStyle}>{contentElement}</View>
                </Pressable>
            );
        }

        return (
            <View
                ref={ref}
                {...pressableProps}
                style={[
                    ...containerStyle,
                    typeof style === "function" ? undefined : style,
                ]}
            >
                {contentElement}
            </View>
        );
    },
);
