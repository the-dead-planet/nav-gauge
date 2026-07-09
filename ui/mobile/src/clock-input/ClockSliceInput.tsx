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
import { ClockInputProps, useTheme, TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, snapSlice, clockAngleToRadians, svgAtan2ToClockAngle, describeArc } from "@ui";

const sizeMap: Record<string, number> = { xs: 42, sm: 80, md: 100 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2.5, md: 3 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };
const tickMajorLengths: Record<string, number> = { xs: 3.5, sm: 6, md: 7 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 3.5, md: 4 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };

export const ClockSliceInput = forwardRef<View, ClockInputProps & { style?: ViewStyle }>(({
    color = 'neutral',
    highlightColor,
    size = 'sm',
    value = 0,
    min = 0,
    max = 85,
    step = 1,
    label,
    onChange,
    disabled = false,
    style,
}, ref) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - 4;
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];

    const arcStartAngle = min;
    const arcEndAngle = max;

    const pointerRad = clockAngleToRadians(value);
    const pointerLen = outerRadius - 3;
    const pointerX = Math.cos(pointerRad) * pointerLen;
    const pointerY = Math.sin(pointerRad) * pointerLen;

    const startRad = clockAngleToRadians(arcStartAngle);
    const endRad = clockAngleToRadians(arcEndAngle);
    const arcStartX = center + outerRadius * Math.cos(startRad);
    const arcStartY = center + outerRadius * Math.sin(startRad);
    const arcEndX = center + outerRadius * Math.cos(endRad);
    const arcEndY = center + outerRadius * Math.sin(endRad);
    const arcSweep = ((arcEndAngle - arcStartAngle) % 360 + 360) % 360;
    const wedgePath = `M ${center} ${center} L ${arcStartX} ${arcStartY} A ${outerRadius} ${outerRadius} 0 ${arcSweep > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY} Z`;

    const [isDragging, setIsDragging] = useState(false);
    const svgPageCenterRef = useRef({ x: 0, y: 0 });
    const svgRef = useRef<View>(null);
    const valueRef = useRef(value);
    valueRef.current = value;

    const isLight = theme.mode === 'light';
    const dialColor = theme.color(color, 500, isLight ? 0.25 : 0.35);
    const tickColor = theme.color(color, 500, isLight ? 0.35 : 0.5);
    const tickMajorColor = theme.color(activeHighlight, isLight ? 500 : 300);
    const tickMinorOpacity = isLight ? 0.3 : 0.5;
    const pointerColor = theme.color(activeHighlight, isLight ? 600 : 300);
    const pointerActiveColor = theme.color(activeHighlight, isLight ? 400 : 200);
    const centerDotFill = theme.color(color, 500);
    const thumbFill = theme.color(color, 800);
    const thumbStroke = theme.color(color, 500);
    const thumbFillActive = theme.color(activeHighlight, 900);
    const thumbStrokeActive = theme.color(activeHighlight, isLight ? 600 : 300);
    const labelColor = theme.color('neutral', isLight ? 800 : 200);
    const wedgeFill = theme.color(color, 500, 0.12);

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
    }).filter((tick) => tick.angleDeg >= arcStartAngle && tick.angleDeg <= arcEndAngle);

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
                        <Path
                            d={wedgePath}
                            fill={wedgeFill}
                        />
                        <Path
                            d={describeArc(center, center, outerRadius, arcStartAngle, arcEndAngle)}
                            fill="none"
                            stroke={dialColor}
                            strokeWidth={strokeWidth}
                        />
                        {ticks.map((tick, i) => (
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

ClockSliceInput.displayName = 'ClockSliceInput';
