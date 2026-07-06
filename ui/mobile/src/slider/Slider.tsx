import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    PanResponder,
    View,
    ViewStyle,
} from "react-native";
import { SliderProps, useTheme } from "@ui";

const heights: Record<string, number> = { xs: 16, sm: 22, md: 28 };
const thumbSizes: Record<string, number> = { xs: 12, sm: 14, md: 17 };
const trackThicknesses: Record<string, number> = { xs: 3, sm: 6, md: 8 };

function snap(v: number, min: number, max: number, step: number): number {
    const stepped = Math.round((v - min) / step) * step + min;

    return Math.min(max, Math.max(min, stepped));
}

export const Slider = forwardRef<any, SliderProps & { style?: ViewStyle }>(({
    color = 'neutral',
    highlightColor,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    active,
    disabled = false,
    style,
}, ref) => {
    const theme = useTheme();
    const effectiveHighlightColor = highlightColor || color;
    const isLight = theme.mode === 'light';
    const height = heights[size];
    const thumbSize = thumbSizes[size];
    const trackThickness = trackThicknesses[size];

    const [trackWidth, setTrackWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const hitAreaRef = useRef<View>(null);

    const trackBackground = theme.color(color, 500, isLight ? 0.15 : 0.3);
    const highlightAccent = theme.color(effectiveHighlightColor, isLight ? 600 : 300);
    const fillColor = theme.color(color, 800);
    const strokeColor = theme.color(color, 500);
    const isActive = active || isDragging;
    const highlightTrackColor = isActive ? highlightAccent : theme.color(effectiveHighlightColor, 500);
    const thumbBackground = isActive ? theme.color(effectiveHighlightColor, 900) : fillColor;
    const thumbBorderColor = isActive ? highlightAccent : strokeColor;
    const hitAreaPageXRef = useRef(0);
    const valueRef = useRef(value);
    const startValueRef = useRef(value);
    valueRef.current = value;

    const contextReference = useRef({ disabled, trackWidth, min, max, step, onChange });
    contextReference.current = { disabled, trackWidth, min, max, step, onChange };

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setTrackWidth(e.nativeEvent.layout.width);
        hitAreaRef.current?.measureInWindow((x) => {
            hitAreaPageXRef.current = x;
        });
    }, []);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => {
            const ctx = contextReference.current;
            if (ctx.disabled) {
                return;
            }
            setIsDragging(true);
            startValueRef.current = valueRef.current;
            
            if (ctx.trackWidth > 0) {
                const touchX = evt.nativeEvent.pageX - hitAreaPageXRef.current;
                const ratio = Math.max(0, Math.min(1, touchX / ctx.trackWidth));
                const raw = ctx.min + ratio * (ctx.max - ctx.min);
                const snapped = snap(raw, ctx.min, ctx.max, ctx.step);
                if (snapped !== valueRef.current) {
                    ctx.onChange?.(snapped);
                }
            }
        },
        onPanResponderMove: (_evt, gs) => {
            const ctx = contextReference.current;
            if (ctx.disabled || ctx.trackWidth <= 0) return;
            const ratio = gs.dx / ctx.trackWidth;
            const raw = startValueRef.current + ratio * (ctx.max - ctx.min);
            const snapped = snap(raw, ctx.min, ctx.max, ctx.step);
            if (snapped !== valueRef.current) {
                ctx.onChange?.(snapped);
            }
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
        },
    }), [disabled]);

    const ratio = max > min
        ? Math.max(0, Math.min(1, (value - min) / (max - min)))
        : 0;
    const fillWidth = trackWidth * ratio;

    const containerStyle: ViewStyle = {
        height,
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
        ...style,
    };

    const hitAreaStyle: ViewStyle = {
        height: thumbSize,
        justifyContent: "center",
        marginHorizontal: thumbSize / 2,
    };

    const trackStyle: ViewStyle = {
        height: trackThickness,
        backgroundColor: trackBackground,
        borderRadius: trackThickness / 2,
        position: "relative",
    };

    const fillStyle: ViewStyle = {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: fillWidth,
        backgroundColor: highlightTrackColor,
        borderRadius: trackThickness / 2,
    };

    const thumbStyle: ViewStyle = {
        position: "absolute",
        left: fillWidth - thumbSize / 2,
        top: -(thumbSize - trackThickness) / 2,
        width: thumbSize,
        height: thumbSize,
        backgroundColor: thumbBackground,
        borderWidth: 2,
        borderColor: thumbBorderColor,
        transform: [{ rotate: "45deg" }],
        ...(isActive ? {
            boxShadow: `0px 0px 4px ${highlightAccent}, 0px 0px 20px ${theme.color(effectiveHighlightColor, 900)}`,
        } : {}),
    };

    return (
        <View ref={ref} style={containerStyle}>
            <View
                ref={hitAreaRef}
                onLayout={handleLayout}
                style={hitAreaStyle}
                {...panResponder.panHandlers}
            >
                <View style={trackStyle}>
                    <View style={fillStyle} />
                    <View style={thumbStyle} />
                </View>
            </View>
        </View>
    );
});

Slider.displayName = 'Slider';
