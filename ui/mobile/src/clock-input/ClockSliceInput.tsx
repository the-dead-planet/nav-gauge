import { forwardRef } from "react";
import {
    View,
    ViewStyle,
    Text,
    TextStyle,
} from "react-native";
import { Path } from "react-native-svg";
import { ClockSvg } from "./ClockSvg";
import { ClockInputProps, useTheme, STEP_DEG, clockAngleToRadians, pointerCoords } from "@ui";
import { ClockLabel } from "./ClockLabel";

const sizeMap: Record<string, number> = { xs: 42, sm: 80, md: 100 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2.5, md: 3 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };
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

    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

    const startRad = clockAngleToRadians(arcStartAngle);
    const endRad = clockAngleToRadians(arcEndAngle);
    const arcStartX = center + outerRadius * Math.cos(startRad);
    const arcStartY = center + outerRadius * Math.sin(startRad);
    const arcEndX = center + outerRadius * Math.cos(endRad);
    const arcEndY = center + outerRadius * Math.sin(endRad);
    const arcSweep = ((arcEndAngle - arcStartAngle) % 360 + 360) % 360;
    const wedgePath = `M ${center} ${center} L ${arcStartX} ${arcStartY} A ${outerRadius} ${outerRadius} 0 ${arcSweep > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY} Z`;

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
            <ClockLabel
                label={label}
                value={value}
                labelStyle={labelStyle}
                valueStyle={valueStyle}
            />
            <ClockSvg
                svgSize={svgSize}
                size={size}
                center={center}
                outerRadius={outerRadius}
                strokeWidth={strokeWidth}
                pointerX={pointerX}
                pointerY={pointerY}
                centerDotRadius={centerDotRadius}
                thumbRadius={thumbRadius}
                min={arcStartAngle}
                max={arcEndAngle}
                dialColor={dialColor}
                tickColor={tickColor}
                tickMajorColor={tickMajorColor}
                tickMinorOpacity={tickMinorOpacity}
                pointerColor={pointerColor}
                pointerActiveColor={pointerActiveColor}
                centerDotFill={centerDotFill}
                thumbFill={thumbFill}
                thumbStroke={thumbStroke}
                thumbFillActive={thumbFillActive}
                thumbStrokeActive={thumbStrokeActive}
                disabled={disabled}
                onChange={onChange}
                step={step}
                value={value}
            >
                <Path
                    d={wedgePath}
                    fill={wedgeFill}
                />
            </ClockSvg>
        </View>
    );
});

ClockSliceInput.displayName = 'ClockSliceInput';
