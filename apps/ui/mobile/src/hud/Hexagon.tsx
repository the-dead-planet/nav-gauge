import { FC, useId, useState } from "react";
import { View, ViewStyle, StyleProp, StyleSheet, Pressable } from "react-native";
import Svg, { Polygon, Defs, ClipPath, G, LinearGradient, Stop } from "react-native-svg";
import { ColorVariant, HexagonProps, SizeVariant, useTheme } from "@ui";

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

export const Hexagon: FC<HexagonProps & { style?: StyleProp<ViewStyle> }> = ({
    shape = "pointy-top",
    strokeWidth = 2,
    color,
    highlightColor,
    variant,
    themeMode,
    size,
    interactive = false,
    active = false,
    hoverStyle,
    style,
    children
}) => {
    const theme = useTheme();
    const [pressed, setPressed] = useState(false);
    const hl = pressed || active;
    const isPointy = shape === "pointy-top";
    const points = isPointy ? POINTY_TOP : FLAT_TOP;
    const aspectRatio = isPointy ? 86.6 / 100 : 100 / 86.6;
    const strokeColor = color ? theme.color(color as ColorVariant, 500) : undefined;
    const hlColor = (highlightColor || color) ? theme.color((highlightColor || color) as ColorVariant, 500) : undefined;
    const isLight = themeMode !== undefined ? !themeMode : theme.mode === 'light';
    const clipPathId = useId();

    const renderGlow = () => {
        if (!hl || !interactive) return null;

        const glowColor = hlColor || strokeColor || theme.color("neutral", 500);
        const glowOpacity = hoverStyle === "fill" ? 0.18 : 0.12;

        return (
            <Polygon
                points={points}
                fill={glowColor}
                fillOpacity={glowOpacity}
                stroke="none"
            />
        );
    };

    const renderVariant = () => {
        if (variant === 'inset') {
            const bgTint = theme.color(color as ColorVariant, 500, 0.10);
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
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                </>
            );
        }

        if (variant === 'fill-translucent') {
            const fill = hl && hlColor
                ? theme.color((highlightColor || color) as ColorVariant, 500, 0.36)
                : theme.color(color as ColorVariant, 500, 0.24);
            return (
                <>
                    <Polygon
                        points={points}
                        fill={fill}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                    {renderGlow()}
                </>
            );
        }

        if (variant === 'fill') {
            const bgShade = color === 'neutral' ? 800 : 900;
            const hlShade = (highlightColor || color) === 'neutral' ? 800 : 900;
            const fillColor = hl && hlColor
                ? theme.color((highlightColor || color) as ColorVariant, hlShade)
                : theme.color(color as ColorVariant, bgShade);
            const borderColor = hl && hlColor
                ? theme.color((highlightColor || color) as ColorVariant, 300)
                : strokeColor;

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

        const bgFill = hl && hlColor
            ? theme.color((highlightColor || color) as ColorVariant, 500, 0.24)
            : 'none';

        return (
            <>
                <Polygon
                    points={points}
                    fill={bgFill}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
                {renderGlow()}
            </>
        );
    };

    const container = (
        <View style={[styles.container, { aspectRatio }, size ? { width: sizeWidth[size] } : undefined, style]}>
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
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
            >
                {container}
            </Pressable>
        );
    }

    return container;
};
