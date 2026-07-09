import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    PanResponder,
    View,
    ViewStyle,
    Text,
    TextStyle,
} from "react-native";
import Svg, { Circle, Line, Path, G } from "react-native-svg";
import { ClockInputProps, useTheme, TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, snapSlice, clockAngleToRadians, svgAtan2ToClockAngle, describeArc, CLOCK_INPUT_RANGE } from "@ui";

const sizeMap: Record<string, number> = { xs: 42, sm: 80, md: 100 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2.5, md: 3 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };
const tickMajorLengths: Record<string, number> = { xs: 3.5, sm: 6, md: 7 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 3.5, md: 4 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };

export const ClockInput = forwardRef<View, ClockInputProps & { style?: ViewStyle }>(({
    color = 'neutral',
    highlightColor,
    size = 'md',
    variant = 'fill-translucent',
    value = CLOCK_INPUT_RANGE[0],
    min = CLOCK_INPUT_RANGE[0],
    max = CLOCK_INPUT_RANGE[1],
    step = STEP_DEG,
    label,
    onChange,
    disabled = false,
    style,
}, ref) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const paddings: Record<string, number> = { xs: 7, sm: 8, md: 9 };
    const outerRadius = center - paddings[size];
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];
    const isFullCircle = max - min >= 360;

    const [isDragging, setIsDragging] = useState(false);
    const svgPageCenterRef = useRef({ x: 0, y: 0 });
    const svgRef = useRef<View>(null);
    const valueRef = useRef(value);
    valueRef.current = value;

    const isLight = theme.mode === 'light';
    const useDark = variant === 'fill';
    const useRegular = variant === 'fill-inverse';
    const defaultDialColor = theme.color(color, 500, isLight ? 0.25 : 0.35);
    const defaultTickColor = theme.color(color, 500, isLight ? 0.35 : 0.5);
    const dialColor = useDark ? theme.color(color, 800) : defaultDialColor;
    const tickColor = useDark ? theme.color(color, 800) : defaultTickColor;
    const tickMajorColor = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 500 : 300);
    const tickMinorOpacity = (useDark || useRegular) ? 0.5 : (isLight ? 0.3 : 0.5);
    const pointerColor = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 600 : 300);
    const pointerActiveColor = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 400 : 200);
    const centerDotFill = (useDark || useRegular)
        ? theme.color(color, useRegular ? 500 : 800)
        : theme.color(color, 500);
    const thumbFill = useDark ? theme.color(color, 500) : theme.color(color, 800);
    const thumbStroke = useDark ? theme.color(color, 800) : theme.color(color, 500);
    const thumbFillActive = useDark ? theme.color(color, 100) : theme.color(activeHighlight, 900);
    const thumbStrokeActive = useDark ? theme.color(color, 800) : theme.color(activeHighlight, isLight ? 600 : 300);
    const labelColor = theme.color('neutral', isLight ? 800 : 200);

    const handleLayout = useCallback((_e: LayoutChangeEvent) => {
        svgRef.current?.measureInWindow((x, y, width, height) => {
            svgPageCenterRef.current = {
                x: x + width / 2,
                y: y + height / 2,
            };
        });
    }, []);

    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const handleInteraction = useCallback((pageX: number, pageY: number) => {
        if (disabledRef.current) {
            return;
        }
        const { x: cx, y: cy } = svgPageCenterRef.current;
        const dx = pageX - cx;
        const dy = pageY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
            return;
        }
        const clockAngle = svgAtan2ToClockAngle(dx, dy);
        const snapped = snapSlice(clockAngle, min, max, step);
        if (snapped !== valueRef.current) {
            valueRef.current = snapped;
            onChangeRef.current?.(snapped);
        }
    }, [min, max, step]);

    const contextRef = useRef({ handleInteraction });
    contextRef.current = { handleInteraction };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: (evt) => {
            if (disabledRef.current) {
                return;
            }
            setIsDragging(true);
            contextRef.current.handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderMove: (evt) => {
            if (disabledRef.current) {
                return;
            }
            contextRef.current.handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);
        },
    }), []);

    const pointerRad = clockAngleToRadians(value);
    const pointerLen = outerRadius - 3;
    const pointerX = Math.cos(pointerRad) * pointerLen;
    const pointerY = Math.sin(pointerRad) * pointerLen;

    const bgCircleFill = variant === 'fill'
        ? theme.color(color, 500)
        : variant === 'fill-inverse'
            ? theme.color(color, 800)
            : theme.color(color, 500, 0.24);

    const containerStyle: ViewStyle = {
        alignItems: 'center',
        opacity: disabled ? 0.4 : 1,
        ...style,
    };

    const labelStyle: TextStyle = {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.4,
        color: labelColor,
        marginBottom: 2,
    };

    const valueStyle: TextStyle = {
        fontSize: 10,
        fontVariant: ['tabular-nums'],
        color: labelColor,
        opacity: 0.7,
    };

    const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
        const angleDeg = i * STEP_DEG;
        const isMajor = i % MAJOR_TICK_INTERVAL === 0;
        const tickLen = isMajor ? tickMajorLengths[size] : tickMinorLengths[size];
        const tickWidth = isMajor ? strokeWidth : strokeWidth * 0.6;
        const rad = clockAngleToRadians(angleDeg);
        const innerR = outerRadius - tickLen;
        return {
            x1: center + Math.cos(rad) * innerR,
            y1: center + Math.sin(rad) * innerR,
            x2: center + Math.cos(rad) * outerRadius,
            y2: center + Math.sin(rad) * outerRadius,
            width: tickWidth,
            isMajor,
            angleDeg,
        };
    });

    return (
        <View ref={ref} style={containerStyle}>
            {label && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={labelStyle}>{label}</Text>
                    <View style={{ minWidth: 40, alignItems: 'flex-end' }}>
                        <Text style={valueStyle}>{value}°</Text>
                    </View>
                </View>
            )}
            <View
                ref={svgRef}
                onLayout={handleLayout}
                collapsable={false}
                {...panResponder.panHandlers}
            >
                <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                    <G>
                        <Circle
                            cx={center}
                            cy={center}
                            r={outerRadius + strokeWidth}
                            fill={bgCircleFill}
                        />
                        {isFullCircle ? (
                            <Circle
                                cx={center}
                                cy={center}
                                r={outerRadius}
                                fill="none"
                                stroke={dialColor}
                                strokeWidth={strokeWidth}
                            />
                        ) : (
                            <Path
                                d={describeArc(center, center, outerRadius, min, max)}
                                fill="none"
                                stroke={dialColor}
                                strokeWidth={strokeWidth}
                            />
                        )}
                        {ticks.filter((tick) => isFullCircle || (tick.angleDeg >= min && tick.angleDeg <= max)).map((tick, i) => (
                            <Line
                                key={i}
                                x1={tick.x1}
                                y1={tick.y1}
                                x2={tick.x2}
                                y2={tick.y2}
                                stroke={tick.isMajor ? tickMajorColor : tickColor}
                                strokeWidth={tick.width}
                                strokeLinecap="round"
                                opacity={tick.isMajor ? 1 : tickMinorOpacity}
                            />
                        ))}
                        <Line
                            x1={center}
                            y1={center}
                            x2={center + pointerX}
                            y2={center + pointerY}
                            stroke={isDragging ? pointerActiveColor : pointerColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                        <Circle
                            cx={center}
                            cy={center}
                            r={centerDotRadius}
                            fill={centerDotFill}
                        />
                        <Circle
                            cx={center + pointerX}
                            cy={center + pointerY}
                            r={thumbRadius}
                            fill={isDragging ? thumbFillActive : thumbFill}
                            stroke={isDragging ? thumbStrokeActive : thumbStroke}
                            strokeWidth={strokeWidth}
                        />
                    </G>
                </Svg>
            </View>
        </View>
    );
});

ClockInput.displayName = 'ClockInput';
