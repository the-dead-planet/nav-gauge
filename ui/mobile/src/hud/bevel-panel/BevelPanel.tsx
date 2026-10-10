import { FC, Ref, useState } from "react";
import {
    View,
    ViewStyle,
    StyleProp,
    StyleSheet,
    Pressable,
    GestureResponderEvent,
    LayoutChangeEvent,
    type ViewInstance,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { BevelPanelProps, ColorVariant, SizeVariant, useTheme } from "@ui";
import { TRANSLUCENT_OPACITY_BACKGROUND } from "../../tinkers";

const bevelMap: Record<SizeVariant, number> = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
};

interface Props {
    forwardRef?: Ref<ViewInstance>;
    onPress?: (e: GestureResponderEvent) => void;
    onLongPress?: (e: GestureResponderEvent) => void;
    onPressIn?: (e: GestureResponderEvent) => void;
    onPressOut?: (e: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    content: {
        position: "relative",
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

export const BevelPanel: FC<BevelPanelProps & Props> = ({
    forwardRef,
    color: colorProp,
    highlightColor: highlightColorProp,
    variant,
    glowStyle = "none",
    size = 'lg',
    interactive = false,
    active = false,
    disabled = false,
    onPress,
    onLongPress,
    onPressIn: onParentPressIn,
    onPressOut: onParentPressOut,
    style,
    children,
}) => {
    const theme = useTheme();
    const highlightColor = (highlightColorProp || colorProp) as ColorVariant;
    const [pressed, setPressed] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const highlight = !disabled && (pressed || active);
    const isLight = theme.mode === 'light';

    const color = (colorProp || 'neutral') as ColorVariant;
    const baseColor = theme.color(color, 500);
    const highlight500 = theme.color(highlightColor, 500);
    const highlightAccent = theme.color(highlightColor, isLight ? 600 : 300);

    const showGlow = !disabled && (glowStyle !== 'none') && (pressed || active);

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
    };

    const strokeWidth = variant === 'fill' ? 0 : 1;
    const strokeInset = strokeWidth / 2;

    const bevel = bevelMap[size];
    const effectiveBevel = containerWidth > 0
        ? Math.min(bevel, containerWidth / 2 - 1)
        : bevel;

    const points = containerWidth > 0 && containerHeight > 0
        ? `${effectiveBevel},${strokeInset} ${containerWidth - effectiveBevel},${strokeInset} ${containerWidth - strokeInset},${containerHeight / 2} ${containerWidth - effectiveBevel},${containerHeight - strokeInset} ${effectiveBevel},${containerHeight - strokeInset} ${strokeInset},${containerHeight / 2}`
        : "";

    const renderGlow = () => {
        if (!showGlow || !points) return null;
        return <GlowPolygons points={points} glowColor={highlightAccent} strokeWidth={2} />;
    };

    const renderVariant = () => {
        if (!points) return null;

        if (disabled) {
            return (
                <Polygon
                    points={points}
                    fill={theme.color(color, isLight ? 200 : 800)}
                    stroke={theme.color(color, isLight ? 300 : 700)}
                    strokeWidth={variant === 'fill' ? 0 : strokeWidth}
                />
            );
        }

        switch (variant) {
            case 'fill': {
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = highlightAccent;
                    borderColor = highlightAccent;
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
                    fillColor = theme.color(color, bgShade);
                    borderColor = highlightAccent;
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

            case 'fill-translucent': {
                const fill = highlight
                    ? theme.color(highlightColor, active ? (isLight ? 600 : 300) : 500, active ? 0.48 : 0.36)
                    : theme.color(color, 500, TRANSLUCENT_OPACITY_BACKGROUND);
                const border = highlight ? highlightAccent : baseColor;
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

            default: {
                const isOutline = variant === 'outline';
                const isGhost = variant === 'ghost';
                let bgFill: string;
                let fillOpacity: number | undefined;
                let bColor: string;
                if (active) {
                    bgFill = highlightAccent;
                    fillOpacity = isGhost ? 0.14 : 0.24;
                    bColor = isGhost ? 'transparent' : highlightAccent;
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
            onLayout={onLayout}
            style={[
                styles.container,
                style,
            ]}
        >
            {containerWidth > 0 && containerHeight > 0 && (
                <Svg
                    viewBox={`0 0 ${containerWidth} ${containerHeight}`}
                    style={StyleSheet.absoluteFill}
                >
                    {renderVariant()}
                </Svg>
            )}
            <View
                style={[
                    styles.content,
                ]}
            >
                {children}
            </View>
        </View>
    );

    if (interactive) {
        return (
            <Pressable
                disabled={disabled}
                accessibilityState={{ disabled }}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={(e) => {
                    if (!disabled) {
                        setPressed(true);
                        onParentPressIn?.(e);
                    }
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
