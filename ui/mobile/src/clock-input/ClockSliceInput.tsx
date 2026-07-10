import { forwardRef } from "react";
import {
    View,
    ViewStyle,
} from "react-native";
import { Path } from "react-native-svg";
import { ClockSvg } from "./ClockSvg";
import { ClockInputProps, useTheme, STEP_DEG, clockAngleToRadians, pointerCoords } from "@ui";
import { ClockLabel } from "./ClockLabel";
import { sizeMap, thumbRadii, centerDotRadii, strokeWidths } from "./constants";

export const ClockSliceInput = forwardRef<View, ClockInputProps & { style?: ViewStyle }>(({
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-translucent',
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

    const wedgeFill = theme.color(color, 500, 0.12);

    const containerStyle: ViewStyle = {
        alignItems: 'center',
        opacity: disabled ? 0.4 : 1,
        ...style,
    };

    return (
        <View ref={ref} style={containerStyle}>
            <ClockLabel
                label={label}
                value={value}
                isLight={theme.isLight}
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
                color={color}
                activeHighlight={activeHighlight}
                variant={variant}
                isLight={theme.isLight}
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
