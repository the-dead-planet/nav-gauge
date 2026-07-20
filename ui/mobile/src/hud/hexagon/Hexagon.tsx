import { FC, Ref, useId, useState } from "react";
import { View, ViewStyle, StyleProp, StyleSheet, Pressable, GestureResponderEvent } from "react-native";
import Svg, { Polygon, Defs, ClipPath, G, LinearGradient, Stop } from "react-native-svg";
import { HexagonProps, SizeVariant, useTheme } from "@ui";

const POINTY_TOP = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";
const FLAT_TOP = "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7";

const sizeWidth: Record<SizeVariant, number> = {
    xs: 36,
    sm: 48,
    md: 64,
};

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

const GlowPolygons: FC<{ points: string; glowColor: string; strokeWidth: number }> = ({
    points,
    glowColor,
    strokeWidth,
}) => (
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

interface Props {
    forwardRef?: Ref<View>;
    onPress?: (e: GestureResponderEvent) => void;
    onLongPress?: (e: GestureResponderEvent) => void;
    onPressIn?: (e: GestureResponderEvent) => void;
    onPressOut?: (e: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>
}

export const Hexagon: FC<HexagonProps & Props> = ({
    forwardRef,
    shape = "pointy-top",
    strokeWidth = 2,
    color = "neutral",
    highlightColor = color,
    variant,
    glowStyle = "none",
    themeMode,
    size,
    interactive = false,
    active = false,
    onPress,
    onLongPress,
    onPressIn: onParentPressIn,
    onPressOut: onParentPressOut,
    style,
    children
}) => {
    const theme = useTheme();
    const [pressed, setPressed] = useState(false);
    const [glowDrawn, setGlowDrawn] = useState(false);
    const hl = pressed || active;
    const isPointy = shape === "pointy-top";
    const points = isPointy ? POINTY_TOP : FLAT_TOP;
    const aspectRatio = isPointy ? 86.6 / 100 : 100 / 86.6;
    const effectiveTheme = themeMode || theme.mode;
    const isLight = effectiveTheme === 'light';
    const clipPathId = useId();

    const baseColor = theme.color(color, 500);
    const highlight500 = theme.color(highlightColor, 500);
    const highlightAccent = theme.color(highlightColor, isLight ? 600 : 300);

    const showGlow = (glowStyle !== 'none') && (hl || glowDrawn);

    const markGlowDrawn = () => {
        if (glowStyle !== 'none') {
            setGlowDrawn(true);
        }
    };

    const renderGlow = () => {
        if (!showGlow) return null;
        return <GlowPolygons points={points} glowColor={highlightAccent} strokeWidth={strokeWidth} />;
    };

    const renderVariant = () => {
        switch (variant) {
            case 'inset': {
                const bgTint = theme.color(color, 500, 0.10);
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
                            <LinearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor={shadowColor} stopOpacity={shadowOpacity} />
                                <Stop offset="15%" stopColor={shadowColor} stopOpacity={0} />
                                <Stop offset="100%" stopColor={shadowColor} stopOpacity={0} />
                            </LinearGradient>
                            <LinearGradient id="highlightGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                                <Stop offset="0%" stopColor={lightColor} stopOpacity={lightOpacity} />
                                <Stop offset="15%" stopColor={lightColor} stopOpacity={0} />
                                <Stop offset="100%" stopColor={lightColor} stopOpacity={0} />
                            </LinearGradient>
                        </Defs>
                        <G clipPath={`url(#${clipPathId})`}>
                            <Polygon points={points} fill={bgTint} />
                            {renderGlow()}
                            <Polygon points={points} fill="url(#shadowGrad)" />
                            <Polygon points={points} fill="url(#highlightGrad)" />
                        </G>
                        <Polygon
                            points={points}
                            fill="none"
                            stroke={baseColor}
                            strokeWidth={strokeWidth}
                        />
                    </>
                );
            }

            case 'fill-translucent': {
                const fill = hl
                    ? theme.color(highlightColor, 500, active ? 0.48 : 0.36)
                    : theme.color(color, 500, 0.24);
                const border = hl ? (active ? highlight500 : highlightAccent) : baseColor;
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

            case 'fill': {
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = theme.color(highlightColor, 500);
                    borderColor = highlight500;
                } else if (pressed) {
                    fillColor = highlightAccent;
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, 500);
                    borderColor = baseColor;
                }
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

            case 'fill-inverse': {
                const isNeutral = color === 'neutral';
                const hlIsNeutral = highlightColor === 'neutral';
                const bgShade = isLight ? 100 : (isNeutral ? 800 : 900);
                const hlBgShade = isLight ? 100 : (hlIsNeutral ? 800 : 900);
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = theme.color(highlightColor, hlBgShade);
                    borderColor = highlight500;
                } else if (pressed) {
                    fillColor = theme.color(highlightColor, hlBgShade);
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, bgShade);
                    borderColor = baseColor;
                }
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
                // ghost / outline
                const isOutline = variant === 'outline';
                const isGhost = variant === 'ghost';
                let bgFill: string;
                let fillOpacity: number | undefined;
                let bColor: string;
                if (active) {
                    bgFill = highlight500;
                    fillOpacity = isGhost ? 0.14 : 0.24;
                    bColor = isGhost ? 'transparent' : highlight500;
                } else if (pressed) {
                    bgFill = highlightAccent;
                    fillOpacity = isGhost ? 0.10 : 0.12;
                    bColor = isGhost ? 'transparent' : highlightAccent;
                } else {
                    bgFill = 'none';
                    fillOpacity = undefined;
                    bColor = isOutline ? baseColor : 'transparent';
                }
                return (
                    <>
                        <Polygon
                            points={points}
                            fill={bgFill}
                            fillOpacity={fillOpacity}
                            stroke={bColor}
                            strokeWidth={strokeWidth}
                        />
                        {renderGlow()}
                    </>
                );
            }
        }
    };

    const container = (
        <View
            ref={forwardRef}
            style={[
                styles.container,
                { aspectRatio },
                size ? { width: sizeWidth[size] } : undefined,
                style
            ]}
        >
            <Svg
                viewBox={isPointy ? "6.7 0 86.6 100" : "0 6.7 100 86.6"}
                style={StyleSheet.absoluteFill}
            >
                {renderVariant()}
            </Svg>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );

    if (interactive) {
        return (
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={(e) => {
                    setPressed(true);
                    markGlowDrawn();
                    onParentPressIn?.(e);
                }}
                onPressOut={(e) => {
                    setPressed(false);
                    onParentPressOut?.(e);
                }}
            >
                {container}
            </Pressable>
        );
    }

    return container;
};
