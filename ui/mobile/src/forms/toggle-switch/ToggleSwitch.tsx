import { FC, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { controlTextSpecifications, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, SizeVariant, ToggleSwitchProps, useTheme } from "@ui";
import { Text } from "../../design-system/typography";
import { Lamp } from "./Lamp";
import { ThumbBody } from "./ThumbBody";

const metricsBySize: Record<SizeVariant, {
    track: number;
    stickLength: number;
    stickThickness: number;
    pivot: number;
    knob: number;
    lamp: number;
    gap: number;
}> = {
    xs: { track: 28, stickLength: 12, stickThickness: 8, pivot: 5, knob: 8, lamp: 6, gap: 6 },
    sm: { track: 34, stickLength: 14, stickThickness: 10, pivot: 6, knob: 9, lamp: 8, gap: 8 },
    md: { track: 40, stickLength: 16, stickThickness: 12, pivot: 7, knob: 10, lamp: 10, gap: 10 },
    lg: { track: 46, stickLength: 18, stickThickness: 14, pivot: 8, knob: 12, lamp: 12, gap: 12 },
};

const clipPaths = {
    xs: { pivotStart: 0.125, pivotEnd: 0.875, knobStart: 0, knobEnd: 1 },
    sm: { pivotStart: 0.15, pivotEnd: 0.85, knobStart: 0.05, knobEnd: 0.95 },
    md: { pivotStart: 0.1667, pivotEnd: 0.8333, knobStart: 0.0833, knobEnd: 0.9167 },
    lg: { pivotStart: 0.175, pivotEnd: 0.825, knobStart: 0.1, knobEnd: 0.9 },
} as const;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    toggleRow: {
        alignItems: 'center',
    },
    track: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        overflow: 'visible',
    },
    thumbPart: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    thumbPivot: {
        position: 'absolute',
    },
    pivotHighlight: {
        position: 'absolute',
        top: '15%',
        left: '15%',
        backgroundColor: 'white',
        opacity: 0.14,
    },
    thumbKnob: {
        shadowOpacity: 0.35,
        shadowRadius: 2,
        elevation: 3,
    },
    knobHighlight: {
        position: 'absolute',
        top: '15%',
        left: '15%',
        backgroundColor: 'white',
        opacity: 0.45,
    },
});

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
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    orientation = 'horizontal',
    checked,
    onChange,
    disabled = false,
    active = false,
    label,
    children,
}) => {
    const theme = useTheme();
    const metrics = metricsBySize[size];
    const {
        track: trackSize,
        stickLength,
        stickThickness,
        pivot: thumbPivotSize,
        knob: thumbKnobSize,
        lamp: lampSize,
        gap,
    } = metrics;
    const textStyle = controlTextSpecifications[size];
    const content = label ?? children;

    const errorColor = theme.color('glitch');
    const successColor = theme.color('secured');
    const neutralColor = theme.color('neutral');

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

    const lampOffColor = checked ? neutralColor : errorColor;
    const lampOnColor = checked ? successColor : neutralColor;
    const lampOffOpacity = checked ? 0.3 : 1;
    const lampOnOpacity = checked ? 1 : 0.3;

    const toggleRowStyle: ViewStyle = {
        flexDirection: isHorizontal ? 'row' : 'column',
        gap,
    };

    const thumbContainerStyle: ViewStyle = isHorizontal
        ? {
            width: stickLength,
            height: stickThickness,
            transformOrigin: [0, '50%', 0],
            marginTop: -stickThickness / 2,
        }
        : {
            width: stickThickness,
            height: stickLength,
            transformOrigin: ['50%', 0, 0],
            marginLeft: -stickThickness / 2,
        };

    const thumbAnimatedStyle = isHorizontal
        ? { transform: [{ scaleX: flipAnim }] }
        : { transform: [{ scaleY: flipAnim }] };

    const thumbPivotStyle: ViewStyle = isHorizontal
        ? {
            left: 0,
            top: '50%',
            marginLeft: -thumbPivotSize / 2,
            marginTop: -thumbPivotSize / 2,
            width: thumbPivotSize,
            height: thumbPivotSize,
            borderRadius: thumbPivotSize / 2,
        }
        : {
            top: 0,
            left: '50%',
            marginLeft: -thumbPivotSize / 2,
            marginTop: -thumbPivotSize / 2,
            width: thumbPivotSize,
            height: thumbPivotSize,
            borderRadius: thumbPivotSize / 2,
        };

    const thumbKnobStyle: ViewStyle = isHorizontal
        ? {
            right: 0,
            top: '50%',
            marginRight: -thumbKnobSize / 2,
            marginTop: -thumbKnobSize / 2,
            width: thumbKnobSize,
            height: thumbKnobSize,
            borderRadius: thumbKnobSize / 2,
        }
        : {
            bottom: 0,
            left: '50%',
            marginLeft: -thumbKnobSize / 2,
            marginBottom: -thumbKnobSize / 2,
            width: thumbKnobSize,
            height: thumbKnobSize,
            borderRadius: thumbKnobSize / 2,
        };

    const pivotHighlightStyle: ViewStyle = {
        width: thumbPivotSize * 0.6,
        height: thumbPivotSize * 0.6,
        borderRadius: thumbPivotSize * 0.3,
    };

    const knobHighlightStyle: ViewStyle = {
        width: thumbKnobSize * 0.6,
        height: thumbKnobSize * 0.6,
        borderRadius: thumbKnobSize * 0.3,
    };

    const knobAnimatedStyle = {
        transform: [{ scale: knobScale }],
    };

    return (
        <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked, disabled }}
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={[styles.container, { gap }]}
        >
            {({ pressed }) => {
                const appearanceState = disabled
                    ? 'disabled'
                    : pressed || active
                        ? 'active'
                        : 'default';
                const appearance = theme.resolveAppearance(
                    variant,
                    color,
                    highlightColor,
                    appearanceState,
                );
                const controlAppearance = theme.resolveAppearance(
                    'fill',
                    color,
                    highlightColor,
                    appearanceState,
                );
                const thumbColor = variant === 'fill'
                    ? theme.color(color, theme.isLight ? 300 : 700)
                    : controlAppearance.surface;
                const lampsDisabled = appearanceState === 'disabled';
                const labelColor = appearanceState !== 'disabled'
                    && appearanceState !== 'default'
                    && highlightContentShade !== undefined
                    ? theme.color(highlightColor, highlightContentShade)
                    : appearanceState === 'default' && contentShade !== undefined
                        ? theme.color(color, contentShade)
                        : theme.resolveAppearance().glyphs;
                const trackStyle: ViewStyle = {
                    width: trackSize,
                    height: trackSize,
                    borderRadius: trackSize / 2,
                    borderWidth: appearance.border.width,
                    borderColor: appearance.border.color,
                    backgroundColor: appearance.surface,
                };

                return (
                    <>
                        {typeof content === 'string' || typeof content === 'number' ? (
                            <Text style={[textStyle, { color: labelColor }]}>
                                {content}
                            </Text>
                        ) : content}
                        <View style={[styles.toggleRow, toggleRowStyle]}>
                            <Lamp
                                color={lampsDisabled ? appearance.glyphs : lampOffColor}
                                size={lampSize}
                                opacity={lampsDisabled ? 1 : lampOffOpacity}
                                glowColor={lampsDisabled || checked ? undefined : errorColor}
                            />
                            <View style={[styles.track, trackStyle]}>
                                <Animated.View style={[styles.thumbContainer, thumbContainerStyle, thumbAnimatedStyle]}>
                                    <ThumbBody
                                        width={isHorizontal ? stickLength : stickThickness}
                                        height={isHorizontal ? stickThickness : stickLength}
                                        color={thumbColor}
                                        points={bodyPoints}
                                        orientation={orientation}
                                    />
                                    <View style={[styles.thumbPivot, thumbPivotStyle, { backgroundColor: thumbColor }]}>
                                        <View style={[styles.pivotHighlight, pivotHighlightStyle]} />
                                    </View>
                                    <Animated.View style={[styles.thumbPart, styles.thumbKnob, thumbKnobStyle, { backgroundColor: thumbColor }, knobAnimatedStyle]}>
                                        <View
                                            style={[
                                                styles.knobHighlight,
                                                knobHighlightStyle,
                                                variant === 'fill' ? { opacity: 0.14 } : undefined,
                                            ]}
                                        />
                                    </Animated.View>
                                </Animated.View>
                            </View>
                            <Lamp
                                color={lampsDisabled ? appearance.glyphs : lampOnColor}
                                size={lampSize}
                                opacity={lampsDisabled ? 1 : lampOnOpacity}
                                glowColor={!lampsDisabled && checked ? successColor : undefined}
                            />
                        </View>
                    </>
                );
            }}
        </Pressable>
    );
};
