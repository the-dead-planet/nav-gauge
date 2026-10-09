import { forwardRef } from 'react';
import { View, ViewStyle, type ViewInstance } from 'react-native';
import { Path } from 'react-native-svg';
import { ClockSvg } from './ClockSvg';
import { ClockInputProps, useTheme, clockAngleToRadians, pointerCoords } from '@ui';
import { ClockLabel } from './ClockLabel';
import { sizeMap, thumbRadii, centerDotRadii, strokeWidths } from './constants';
import { NumberInput } from '../number-input';
import { StepControls } from '../step-controls';

const controlHeights = { xs: 18, sm: 24, md: 32, lg: 40 } as const;

export const ClockSliceInput = forwardRef<ViewInstance, ClockInputProps & { style?: ViewStyle }>(
    (
        {
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
            showNumberInput = false,
            showStepControls = false,
            numberInputPlacement = 'end',
            ariaLabel,
            style,
        },
        ref,
    ) => {
        const theme = useTheme();
        const activeHighlight = highlightColor || color;
        const svgSize = sizeMap[size];
        const center = svgSize / 2;
        const outerRadius = center - 4;
        const thumbRadius = thumbRadii[size];
        const centerDotRadius = centerDotRadii[size];
        const strokeWidth = strokeWidths[size];
        const stepControlsWidth = svgSize + controlHeights[size] * 2 + 8;

        const arcStartAngle = min;
        const arcEndAngle = max;

        const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

        const startRad = clockAngleToRadians(arcStartAngle);
        const endRad = clockAngleToRadians(arcEndAngle);
        const arcStartX = center + outerRadius * Math.cos(startRad);
        const arcStartY = center + outerRadius * Math.sin(startRad);
        const arcEndX = center + outerRadius * Math.cos(endRad);
        const arcEndY = center + outerRadius * Math.sin(endRad);
        const arcSweep = (((arcEndAngle - arcStartAngle) % 360) + 360) % 360;
        const wedgePath = `M ${center} ${center} L ${arcStartX} ${arcStartY} A ${outerRadius} ${outerRadius} 0 ${arcSweep > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY} Z`;

        const wedgeFill =
            variant === 'fill'
                ? theme.color(color, 500)
                : variant === 'fill-inverse'
                  ? theme.color(color, theme.isLight ? 100 : color === 'neutral' ? 800 : 900)
                  : theme.color(color, 500, 0.12);

        const containerStyle: ViewStyle = {
            alignItems: 'center',
            opacity: disabled ? 0.4 : 1,
            ...style,
        };

        const clock = (
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
                disabled={disabled}
                onChange={onChange}
                step={step}
                value={value}
            >
                <Path d={wedgePath} fill={wedgeFill} />
            </ClockSvg>
        );
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
        ) : (
            clock
        );
        const isVerticalNumberInput = numberInputPlacement === 'above' || numberInputPlacement === 'below';

        return (
            <View ref={ref} style={containerStyle}>
                <ClockLabel label={label} value={value} isLight={theme.isLight} showValue={!showNumberInput} />
                <View
                    style={{
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
                    }}
                >
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
                                highlightColor={highlightColor}
                                size={size}
                                variant={variant}
                                disabled={disabled || !onChange}
                                showStepControls={true}
                                ariaLabel={`${ariaLabel ?? label ?? 'Angle'} (#)`}
                            />
                        </View>
                    ) : null}
                </View>
            </View>
        );
    },
);

ClockSliceInput.displayName = 'ClockSliceInput';
