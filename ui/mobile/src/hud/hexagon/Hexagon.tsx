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
import { HexagonProps, useTheme } from "@ui";
import { TRANSLUCENT_OPACITY } from "../../tinkers";

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
            variant = "fill-inverse",
            activeGlow = "none",
            size,
            interactive = false,
            active = false,
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
        const isActiveState = !disabled && (pressed || active);
        const isPointy = shape === "pointy-top";
        const points = isPointy ? POINTY_TOP : FLAT_TOP;
        const aspectRatio = isPointy ? 86.6 / 100 : 100 / 86.6;
        const isLight = theme.mode === "light";
        const clipPathId = useId();

        const shades = theme.variants[variant].shades;
        const baseColor = theme.color(color, shades.base);
        const activeColor = theme.color(highlightColor, shades.active);

        const showGlow =
            !disabled && activeGlow !== "none" && (isActiveState || glowDrawn);

        const markGlowDrawn = () => {
            if (activeGlow !== "none") {
                setGlowDrawn(true);
            }
        };

        const renderGlow = () => {
            if (!showGlow) return null;
            return (
                <GlowPolygons
                    points={points}
                    glowColor={activeColor}
                    strokeWidth={strokeWidth}
                />
            );
        };

        const renderVariant = () => {
            if (disabled && variant !== "inset") {
                const disabledSurface = theme.color(
                    color,
                    shades.disabledSurface,
                );
                const disabledContent = theme.color(
                    color,
                    shades.disabledContent,
                );
                const fill =
                    variant === "ghost" || variant === "outline"
                        ? "transparent"
                        : theme.color(
                              color,
                              shades.disabledSurface,
                              variant === "fill-translucent"
                                  ? TRANSLUCENT_OPACITY
                                  : undefined,
                          );
                const stroke =
                    variant === "ghost"
                        ? "transparent"
                        : variant === "fill"
                          ? disabledSurface
                          : disabledContent;

                return (
                    <Polygon
                        points={points}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                    />
                );
            }

            switch (variant) {
                case "inset": {
                    const insetSurface = theme.color(
                        color,
                        shades.insetSurface,
                    );
                    const shadowColor = "#000000";
                    const shadowOpacity = isLight ? 0.35 : 0.65;
                    const lightColor = "#ffffff";
                    const lightOpacity = isLight ? 0.45 : 0.12;

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
                                        stopColor={shadowColor}
                                        stopOpacity={shadowOpacity}
                                    />
                                    <Stop
                                        offset="15%"
                                        stopColor={shadowColor}
                                        stopOpacity={0}
                                    />
                                    <Stop
                                        offset="100%"
                                        stopColor={shadowColor}
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
                                        stopColor={lightColor}
                                        stopOpacity={lightOpacity}
                                    />
                                    <Stop
                                        offset="15%"
                                        stopColor={lightColor}
                                        stopOpacity={0}
                                    />
                                    <Stop
                                        offset="100%"
                                        stopColor={lightColor}
                                        stopOpacity={0}
                                    />
                                </LinearGradient>
                            </Defs>
                            <G clipPath={`url(#${clipPathId})`}>
                                <Polygon points={points} fill={insetSurface} />
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
                                stroke={
                                    disabled
                                        ? theme.color(
                                              color,
                                              shades.disabledContent,
                                          )
                                        : isActiveState
                                          ? activeColor
                                          : baseColor
                                }
                                strokeWidth={strokeWidth}
                            />
                        </>
                    );
                }

                case "fill-translucent": {
                    const fill = theme.color(
                        color,
                        shades.base,
                        TRANSLUCENT_OPACITY,
                    );
                    const border = isActiveState
                        ? activeColor
                        : theme.color(color, shades.base, 0.3);
                    return (
                        <>
                            <Polygon
                                points={points}
                                fill={fill}
                                stroke={border}
                                strokeWidth={strokeWidth}
                            />
                            {renderGlow()}
                        </>
                    );
                }

                case "fill": {
                    const fillColor = isActiveState ? activeColor : baseColor;
                    return (
                        <>
                            <Polygon
                                points={points}
                                fill={fillColor}
                                stroke={fillColor}
                                strokeWidth={strokeWidth}
                            />
                            {renderGlow()}
                        </>
                    );
                }

                case "fill-inverse": {
                    const fillColor = theme.color(color, shades.inverseSurface);
                    const borderColor = isActiveState ? activeColor : baseColor;
                    return (
                        <>
                            <Polygon
                                points={points}
                                fill={fillColor}
                                stroke={borderColor}
                                strokeWidth={strokeWidth}
                            />
                            {renderGlow()}
                        </>
                    );
                }

                default: {
                    const isOutline = variant === "outline";
                    return (
                        <>
                            <Polygon
                                points={points}
                                fill={
                                    isOutline && isActiveState
                                        ? baseColor
                                        : "transparent"
                                }
                                fillOpacity={
                                    isOutline && isActiveState
                                        ? 0.16
                                        : undefined
                                }
                                stroke={
                                    isOutline
                                        ? isActiveState
                                            ? activeColor
                                            : baseColor
                                        : "transparent"
                                }
                                strokeWidth={strokeWidth}
                            />
                            {renderGlow()}
                        </>
                    );
                }
            }
        };

        const contentElement = (
            <View
                style={[
                    styles.container,
                    { aspectRatio },
                    size ? { height: theme.sizes.control[size].height } : undefined,
                    interactive || typeof style === "function"
                        ? undefined
                        : style,
                ]}
            >
                <Svg
                    viewBox={isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6"}
                    style={StyleSheet.absoluteFill}
                >
                    {renderVariant()}
                </Svg>
                <View style={styles.content}>{children}</View>
            </View>
        );

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
                    {contentElement}
                </Pressable>
            );
        }

        return (
            <View ref={ref} {...pressableProps}>
                {contentElement}
            </View>
        );
    },
);
