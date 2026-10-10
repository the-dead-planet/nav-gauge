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
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const controlHeights = { xs: 18, sm: 24, md: 32, lg: 40 } as const;

export const ClockInput = forwardRef<ViewInstance, ClockInputProps & { style?: ViewStyle }>(({
    color = 'neutral',
    contentShade,
    highlightColor,
    highlightContentShade,
    size = 'md',
    variant = 'fill-translucent',
    value = CLOCK_INPUT_RANGE[0],
    min = CLOCK_INPUT_RANGE[0],
    max = CLOCK_INPUT_RANGE[1],
    step = STEP_DEG,
    label,
    onChange,
    disabled = false,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = 'end',
    ariaLabel,
    style,
}, ref) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const paddings: Record<string, number> = { xs: 7, sm: 8, md: 9, lg: 10 };
    const outerRadius = center - paddings[size];
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];
    const isFullCircle = max - min >= 360;
    const stepControlsWidth = svgSize + controlHeights[size] * 2 + 8;

    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

    const containerStyle: ViewStyle = {
        alignItems: 'center',
        width: '100%',
        opacity: disabled ? 0.4 : 1,
        ...style,
    };

    const clock = <ClockSvg
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
        isFullCircle={isFullCircle}
        disabled={disabled}
        onChange={onChange}
        step={step}
        value={value}
    />;
    const steppedClock = showStepControls ? (
        <View style={{ width: stepControlsWidth }}>
            <StepControls
                color={color}
                variant={variant}
                size={size}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                ariaLabel={ariaLabel ?? label}
            >
                {clock}
            </StepControls>
        </View>
    ) : clock;
    const isVerticalNumberInput = numberInputPlacement === 'above' || numberInputPlacement === 'below';
    const control = <View style={{
        flexDirection: !showNumberInput
            ? 'row'
            : numberInputPlacement === 'start'
                ? 'row-reverse'
                : numberInputPlacement === 'above'
                    ? 'column-reverse'
                    : numberInputPlacement === 'below'
                        ? 'column'
                        : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        gap: 8,
    }}>
        {steppedClock}
        {showNumberInput ? (
            <View style={{ width: isVerticalNumberInput ? '100%' : 80 }}>
                <NumberInput
                    value={value}
                    onChange={(newValue) => onChange?.(newValue)}
                    min={min}
                    max={max}
                    step={step}
                    color={color}
                    contentShade={contentShade}
                    highlightColor={highlightColor}
                    highlightContentShade={highlightContentShade}
                    size={size}
                    variant={variant}
                    disabled={disabled || !onChange}
                    showStepControls={true}
                    ariaLabel={`${ariaLabel ?? label ?? 'Angle'} (#)`}
                />
            </View>
        ) : null}
    </View>;

    return (
        <View ref={ref} style={containerStyle}>
            <ClockLabel label={label} value={value} isLight={theme.isLight} showValue={!showNumberInput} color={color} contentShade={contentShade} />
            {control}
        </View>
    );
});

ClockInput.displayName = 'ClockInput';
