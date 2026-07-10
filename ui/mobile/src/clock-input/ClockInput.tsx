import { forwardRef } from "react";
import {
    View,
    ViewStyle,
    Text,
    TextStyle,
} from "react-native";
import { Circle } from "react-native-svg";
import { ClockSvg } from "./ClockSvg";
import { ClockInputProps, useTheme, STEP_DEG, pointerCoords, CLOCK_INPUT_RANGE } from "@ui";
import { ClockLabel } from "./ClockLabel";

const sizeMap: Record<string, number> = { xs: 42, sm: 80, md: 100 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2.5, md: 3 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1.25, md: 1.5 };
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



    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

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
                min={min}
                max={max}
                dialColor={dialColor}
                isFullCircle={isFullCircle}
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
                <Circle
                    cx={center}
                    cy={center}
                    r={outerRadius + strokeWidth}
                    fill={bgCircleFill}
                />
            </ClockSvg>
        </View>
    );
});

ClockInput.displayName = 'ClockInput';
