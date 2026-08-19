import { forwardRef } from "react";
import {
    View,
    ViewStyle,
    type ViewInstance,
} from "react-native";
import { ClockSvg } from "./ClockSvg";
import { ClockInputProps, useTheme, STEP_DEG, pointerCoords, CLOCK_INPUT_RANGE } from "@ui";
import { ClockLabel } from "./ClockLabel";
import { sizeMap, thumbRadii, centerDotRadii, strokeWidths } from "./constants";

export const ClockInput = forwardRef<ViewInstance, ClockInputProps & { style?: ViewStyle }>(({
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

    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

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
                min={min}
                max={max}
                color={color}
                activeHighlight={activeHighlight}
                variant={variant}
                isLight={theme.isLight}
                isFullCircle={isFullCircle}
                disabled={disabled}
                onChange={onChange}
                step={step}
                value={value}
            />
        </View>
    );
});

ClockInput.displayName = 'ClockInput';
