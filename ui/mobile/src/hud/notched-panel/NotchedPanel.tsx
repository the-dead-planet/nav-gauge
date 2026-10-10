import { FC, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { ColorVariant, NotchedPanelProps, useTheme } from '@ui';
import { TRANSLUCENT_OPACITY_BACKGROUND } from '../../tinkers';

interface Props extends Omit<ViewProps, 'children' | 'onLayout' | 'style'> {
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
    panel: { position: 'relative', minWidth: 80 },
    header: { minHeight: 38, paddingTop: 9, paddingRight: 32, paddingBottom: 11, paddingLeft: 18 },
    content: { marginHorizontal: 18, marginBottom: 10 },
});

export const NotchedPanel: FC<NotchedPanelProps & Props> = ({
    color: colorProp = 'neutral',
    highlightColor: highlightColorProp,
    variant = 'fill-inverse',
    glowStyle = 'none',
    active = false,
    disabled = false,
    header,
    children,
    style,
    contentStyle,
    ...props
}) => {
    const theme = useTheme();
    const color = colorProp as ColorVariant;
    const highlightColor = (highlightColorProp ?? color) as ColorVariant;
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, headerHeight: 0 });
    const baseColor = theme.color(color, 500);
    const highlight = theme.color(highlightColor, 500);
    const highlightAccent = theme.color(highlightColor, theme.isLight ? 600 : 300);
    const disabledSurface = theme.color(color, theme.isLight ? 200 : 800);
    const disabledForeground = theme.color(color, theme.isLight ? 300 : 700);
    const inverseShade = theme.mode === 'light' ? 100 : color === 'neutral' ? 800 : 900;
    const fill = disabled
        ? disabledSurface
        : variant === 'fill'
        ? active ? highlightAccent : baseColor
        : variant === 'fill-translucent'
            ? active
                ? theme.color(highlightColor, theme.isLight ? 600 : 300, 0.48)
                : theme.color(color, 500, TRANSLUCENT_OPACITY_BACKGROUND)
            : theme.color(color, inverseShade);
    const accent = disabled ? disabledForeground : active ? highlightAccent : highlight;
    const { width, height, headerHeight } = dimensions;
    const notch = Math.min(18, width / 5, height / 4);
    const step = Math.min(10, width / 10);
    const bodyPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - 1},${height - notch} ${width - notch},${height - 1} ${width * 0.58},${height - 1} ${width * 0.54},${height - step} ${notch + step},${height - step} ${notch},${height - 1} 1,${height - notch} 1,${notch}`;
    const headerPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - notch},${headerHeight} ${width * 0.58},${headerHeight} ${width * 0.54},${Math.max(1, headerHeight - step)} ${notch + step},${Math.max(1, headerHeight - step)} 1,${Math.max(1, headerHeight - notch)}`;
    const ready = width > 0 && height > 0;

    const onLayout = (event: LayoutChangeEvent) => {
        const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
        setDimensions((current) => ({ ...current, width: nextWidth, height: nextHeight }));
    };

    return (
        <View {...props} onLayout={onLayout} style={[styles.panel, style]}>
            {ready ? (
                <Svg viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden>
                    {!disabled && glowStyle !== 'none' ? <Polygon points={bodyPoints} fill="none" stroke={accent} strokeWidth={glowStyle === 'glow' ? 10 : 6} strokeOpacity={0.18} /> : null}
                    <Polygon points={bodyPoints} fill={fill} stroke={disabled || active ? accent : baseColor} strokeWidth={variant === 'fill' ? 0 : 2} />
                    <Polyline points={`${notch + 7},${height - 6} ${width * 0.38},${height - 6} ${width * 0.42},${height - 2}`} fill="none" stroke={accent} strokeWidth={2} />
                    {header ? <Polygon points={headerPoints} fill={disabled ? disabledSurface : accent} stroke={accent} strokeWidth={2} /> : null}
                </Svg>
            ) : null}
            {header ? (
                <View onLayout={(event) => setDimensions((current) => ({ ...current, headerHeight: event.nativeEvent.layout.height }))} style={styles.header}>
                    {header}
                </View>
            ) : null}
            <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
    );
};
