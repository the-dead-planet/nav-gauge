import { FC, useEffect, useRef } from "react";
import { Animated, Pressable, View, ViewStyle } from "react-native";
import { ToggleSwitchProps, useTheme } from "@ui";
import { Text } from "../typography";
import { Lamp } from "./Lamp";

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

    const baseColor = theme.color(color);

    const trackSize = size === 'md' ? 40 : size === 'sm' ? 34 : 28;
    const stickLength = size === 'md' ? 16 : size === 'sm' ? 14 : 12;
    const stickThickness = size === 'md' ? 12 : size === 'sm' ? 10 : 8;
    const thumbPivotSize = size === 'md' ? 8 : size === 'sm' ? 7 : 6;
    const thumbKnobSize = size === 'md' ? 10 : size === 'sm' ? 9 : 8;
    const lampSize = size === 'md' ? 10 : size === 'sm' ? 8 : 6;
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;
    const gap = size === 'md' ? 10 : size === 'sm' ? 8 : 6;

    const errorColor = theme.componentColor('error');
    const successColor = theme.componentColor('success');
    const neutralColor = theme.color('grey');

    const isHorizontal = orientation === 'horizontal';

    const knobScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(knobScale, {
                toValue: 1.25,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(knobScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [checked, knobScale]);

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
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap,
        opacity: disabled ? 0.4 : 1,
    };

    const toggleRowStyle: ViewStyle = {
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        gap,
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

    const thumbStyle: ViewStyle = isHorizontal
        ? {
            width: stickLength,
            height: stickThickness,
            backgroundColor: thumbColor,
            transform: [{ scaleX: checked ? 1 : -1 }],
            transformOrigin: [0, '50%', 0],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -stickThickness / 2,
        }
        : {
            width: stickThickness,
            height: stickLength,
            backgroundColor: thumbColor,
            transform: [{ scaleY: checked ? -1 : 1 }],
            transformOrigin: ['50%', 0, 0],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -stickThickness / 2,
        };

    const thumbBodyStyle: ViewStyle = isHorizontal
        ? {
            position: 'absolute',
            inset: 0,
            backgroundColor: thumbColor,
        }
        : {
            position: 'absolute',
            inset: 0,
            backgroundColor: thumbColor,
        };

    const thumbPivotStyle: ViewStyle = isHorizontal
        ? {
            position: 'absolute',
            left: 0,
            top: '50%',
            marginLeft: -thumbPivotSize / 2,
            marginTop: -thumbPivotSize / 2,
            width: thumbPivotSize,
            height: thumbPivotSize,
            borderRadius: thumbPivotSize / 2,
            backgroundColor: thumbColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
        }
        : {
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: -thumbPivotSize / 2,
            marginTop: -thumbPivotSize / 2,
            width: thumbPivotSize,
            height: thumbPivotSize,
            borderRadius: thumbPivotSize / 2,
            backgroundColor: thumbColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
        };

    const thumbKnobStyle: ViewStyle = isHorizontal
        ? {
            position: 'absolute',
            right: 0,
            top: '50%',
            marginRight: -thumbKnobSize / 2,
            marginTop: -thumbKnobSize / 2,
            width: thumbKnobSize,
            height: thumbKnobSize,
            borderRadius: thumbKnobSize / 2,
            backgroundColor: thumbColor,
            transform: [{ scale: knobScale }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.35,
            shadowRadius: 2,
            elevation: 3,
        }
        : {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            marginLeft: -thumbKnobSize / 2,
            marginBottom: -thumbKnobSize / 2,
            width: thumbKnobSize,
            height: thumbKnobSize,
            borderRadius: thumbKnobSize / 2,
            backgroundColor: thumbColor,
            transform: [{ scale: knobScale }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.35,
            shadowRadius: 2,
            elevation: 3,
        };

    return (
        <Pressable
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {children ? (
                <Text style={{ color: baseColor, fontSize, lineHeight: fontSize * 1.1 }}>
                    {children}
                </Text>
            ) : null}
            <View style={toggleRowStyle}>
                <Lamp
                    color={lampOffColor}
                    size={lampSize}
                    opacity={lampOffOpacity}
                    glowColor={checked ? undefined : errorColor}
                />
                <View style={trackStyle}>
                    <View style={thumbStyle}>
                        <View style={thumbPivotStyle} />
                        <View style={thumbBodyStyle} />
                        <Animated.View style={thumbKnobStyle} />
                    </View>
                </View>
                <Lamp
                    color={lampOnColor}
                    size={lampSize}
                    opacity={lampOnOpacity}
                    glowColor={checked ? successColor : undefined}
                />
            </View>
        </Pressable>
    );
};
