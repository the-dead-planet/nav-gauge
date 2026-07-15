import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { ToggleSwitchProps, useTheme } from "@ui";
import { Text } from "../typography";

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'ghost',
    orientation = 'horizontal',
    checked,
    onChange,
    disabled = false,
    children,
}) => {
    const theme = useTheme();

    const accentColor = theme.isLight
        ? theme.color(highlightColor, 600)
        : theme.color(highlightColor, 300);
    const baseColor = theme.color(color);

    const trackSize = size === 'md' ? 40 : size === 'sm' ? 34 : 28;
    const thumbWidth = size === 'md' ? 12 : size === 'sm' ? 10 : 8;
    const thumbHeight = size === 'md' ? 20 : size === 'sm' ? 17 : 14;
    const pivotSize = size === 'md' ? 8 : size === 'sm' ? 7 : 6;
    const knobSize = size === 'md' ? 10 : size === 'sm' ? 9 : 8;
    const lampSize = size === 'md' ? 10 : size === 'sm' ? 8 : 6;
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;
    const gap = size === 'md' ? 10 : size === 'sm' ? 8 : 6;

    const errorColor = theme.componentColor('error');
    const successColor = theme.componentColor('success');
    const neutralColor = theme.color('grey');

    const isHorizontal = orientation === 'horizontal';

    const trackBackgroundColor = (() => {
        switch (variant) {
            case 'fill':
                return baseColor;
            case 'fill-inverse':
                return theme.color(color, 100);
            case 'fill-translucent':
                return theme.color(color, 500, 0.15);
            case 'outline':
                return 'transparent';
            case 'inset':
                return 'transparent';
            case 'ghost':
            default:
                return 'transparent';
        }
    })();

    const trackBorderColor = (() => {
        switch (variant) {
            case 'fill':
                return baseColor;
            case 'fill-inverse':
                return theme.color(color, 100);
            case 'fill-translucent':
                return baseColor;
            case 'outline':
                return baseColor;
            case 'inset':
                return baseColor;
            case 'ghost':
            default:
                return baseColor;
        }
    })();

    const thumbColor = (() => {
        switch (variant) {
            case 'fill':
                return theme.color(color, 100);
            case 'fill-inverse':
                return baseColor;
            case 'fill-translucent':
                return baseColor;
            case 'outline':
                return baseColor;
            case 'inset':
                return baseColor;
            case 'ghost':
            default:
                return baseColor;
        }
    })();

    const lampOffColor = checked ? neutralColor : errorColor;
    const lampOnColor = checked ? successColor : neutralColor;
    const lampOffOpacity = checked ? 0.3 : 1;
    const lampOnOpacity = checked ? 1 : 0.3;

    const containerStyle: ViewStyle = {
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        gap,
        opacity: disabled ? 0.4 : 1,
    };

    const trackStyle: ViewStyle = {
        width: trackSize,
        height: trackSize,
        borderRadius: trackSize / 2,
        borderWidth: 1,
        borderColor: trackBorderColor,
        backgroundColor: trackBackgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    };

    const thumbStyle: ViewStyle = {
        width: thumbWidth,
        height: thumbHeight,
        borderRadius: 2,
        backgroundColor: thumbColor,
        // Tapered shape: narrow at bottom (base), wide at top (handle)
        // In React Native we simulate this with a polygon via overflow and nested views
        transform: [
            { rotate: `${checked ? 25 : -25}deg` },
        ],
        // Position base at center of track
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        marginLeft: -thumbWidth / 2,
    };

    const lampStyle = (lampColor: string, lampOpacity: number): ViewStyle => ({
        width: lampSize,
        height: lampSize,
        borderRadius: lampSize / 2,
        backgroundColor: lampColor,
        opacity: lampOpacity,
    });

    const lampOffGlow = checked ? undefined : `0 0 6px 2px ${errorColor}`;
    const lampOnGlow = checked ? `0 0 6px 2px ${successColor}` : undefined;

    const lampOffElement = (
        <View style={lampStyle(lampOffColor, lampOffOpacity)}>
            {lampOffGlow ? (
                <View style={{
                    width: lampSize,
                    height: lampSize,
                    borderRadius: lampSize / 2,
                    shadowColor: errorColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 4,
                }} />
            ) : null}
        </View>
    );

    const lampOnElement = (
        <View style={lampStyle(lampOnColor, lampOnOpacity)}>
            {lampOnGlow ? (
                <View style={{
                    width: lampSize,
                    height: lampSize,
                    borderRadius: lampSize / 2,
                    shadowColor: successColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 4,
                }} />
            ) : null}
        </View>
    );

    return (
        <Pressable
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {isHorizontal ? lampOffElement : lampOnElement}
            <View style={trackStyle}>
                <View style={thumbStyle} />
            </View>
            {isHorizontal ? lampOnElement : lampOffElement}
            {children ? (
                <Text style={{ color: baseColor, fontSize, lineHeight: fontSize * 1.1 }}>
                    {children}
                </Text>
            ) : null}
        </Pressable>
    );
};
