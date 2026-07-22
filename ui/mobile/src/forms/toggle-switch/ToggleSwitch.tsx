import { FC, useEffect, useRef } from "react";
import { Animated, Pressable, View, ViewStyle } from "react-native";
import { ToggleSwitchProps, useTheme } from "@ui";
import { Text } from "../../typography";
import { Lamp } from "./Lamp";
import { ThumbBody } from "./ThumbBody";

const clipPaths = {
    xs: { pivotStart: 0.125, pivotEnd: 0.875, knobStart: 0, knobEnd: 1 },
    sm: { pivotStart: 0.15, pivotEnd: 0.85, knobStart: 0.05, knobEnd: 0.95 },
    md: { pivotStart: 0.1667, pivotEnd: 0.8333, knobStart: 0.0833, knobEnd: 0.9167 },
} as const;

function buildHorizontalPoints(width: number, height: number, clip: { pivotStart: number; pivotEnd: number; knobStart: number; knobEnd: number }): string {
    const { pivotStart, pivotEnd, knobStart, knobEnd } = clip;
    return `0,${height * pivotStart} ${width},${height * knobStart} ${width},${height * knobEnd} 0,${height * pivotEnd}`;
}

function buildVerticalPoints(width: number, height: number, clip: { pivotStart: number; pivotEnd: number; knobStart: number; knobEnd: number }): string {
    const { pivotStart, pivotEnd, knobStart, knobEnd } = clip;
    return `${width * pivotStart},0 ${width * pivotEnd},0 ${width * knobEnd},${height} ${width * knobStart},${height}`;
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
    color = 'neutral',
    // highlightColor = color, // TODO
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
    const clip = clipPaths[size];

    const bodyPoints = isHorizontal
        ? buildHorizontalPoints(stickLength, stickThickness, clip)
        : buildVerticalPoints(stickThickness, stickLength, clip);

    const flipAnim = useRef(new Animated.Value(checked ? 1 : -1)).current;
    const knobScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(flipAnim, {
            toValue: checked ? 1 : -1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [checked, flipAnim]);

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

    const thumbContainerStyle: ViewStyle = isHorizontal
        ? {
            width: stickLength,
            height: stickThickness,
            transformOrigin: [0, '50%', 0],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -stickThickness / 2,
            overflow: 'visible',
        }
        : {
            width: stickThickness,
            height: stickLength,
            transformOrigin: ['50%', 0, 0],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -stickThickness / 2,
            overflow: 'visible',
        };

    const thumbAnimatedStyle = isHorizontal
        ? { transform: [{ scaleX: flipAnim }] }
        : { transform: [{ scaleY: flipAnim }] };

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

    const pivotHighlightStyle: ViewStyle = {
        position: 'absolute',
        width: thumbPivotSize * 0.6,
        height: thumbPivotSize * 0.6,
        borderRadius: thumbPivotSize * 0.3,
        top: '15%',
        left: '15%',
        backgroundColor: 'white',
        opacity: 0.35,
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
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.35,
            shadowRadius: 2,
            elevation: 3,
        };

    const knobHighlightStyle: ViewStyle = {
        position: 'absolute',
        width: thumbKnobSize * 0.6,
        height: thumbKnobSize * 0.6,
        borderRadius: thumbKnobSize * 0.3,
        top: '15%',
        left: '15%',
        backgroundColor: 'white',
        opacity: 0.45,
    };

    const knobAnimatedStyle = {
        transform: [{ scale: knobScale }],
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
                    <Animated.View style={[thumbContainerStyle, thumbAnimatedStyle]}>
                        <ThumbBody
                            width={isHorizontal ? stickLength : stickThickness}
                            height={isHorizontal ? stickThickness : stickLength}
                            color={thumbColor}
                            points={bodyPoints}
                            orientation={orientation}
                        />
                        <View style={thumbPivotStyle}>
                            <View style={pivotHighlightStyle} />
                        </View>
                        <Animated.View style={[thumbKnobStyle, knobAnimatedStyle]}>
                            <View style={knobHighlightStyle} />
                        </Animated.View>
                    </Animated.View>
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
