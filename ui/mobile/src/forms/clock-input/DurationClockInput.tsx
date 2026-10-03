import { FC, useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, View, ViewStyle, type ViewInstance } from "react-native";
import Svg from "react-native-svg";
import {
    DurationClockInputProps,
    millisecondsToDurationParts,
    ticksToClockDegrees,
    clockDegreesToTicks,
    pointerCoords,
    svgAtan2ToClockAngle,
    snapSlice,
    STEP_DEG,
} from "@ui";
import { ClockDial } from "./ClockDial";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";
import { sizeMap, thumbRadii, centerDotRadii, strokeWidths } from "./constants";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";

const paddings: Record<string, number> = { xs: 7, sm: 8, md: 9 };
const controlHeights = { xs: 18, sm: 24, md: 32 } as const;
const MINUTES_HAND_FRACTION = 0.55;

type Hand = 'minutes' | 'seconds';

export const DurationClockInput: FC<DurationClockInputProps & { style?: ViewStyle }> = ({
    color = 'neutral',
    highlightColor,
    size = 'md',
    variant = 'fill-translucent',
    value,
    min = 0,
    step = 1000,
    onChange,
    disabled = false,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = 'end',
    ariaLabel,
    style,
}) => {
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - paddings[size];
    const strokeWidth = strokeWidths[size];
    const secondsRadius = outerRadius;
    const minutesRadius = outerRadius * MINUTES_HAND_FRACTION;
    const stepControlsWidth = svgSize + controlHeights[size] * 2 + 8;

    const { minutes, seconds } = millisecondsToDurationParts(value);
    const secondsPointer = pointerCoords(ticksToClockDegrees(seconds), secondsRadius);
    const minutesPointer = pointerCoords(ticksToClockDegrees(minutes), minutesRadius);

    const [activeHand, setActiveHand] = useState<Hand | null>(null);
    const activeHandRef = useRef<Hand | null>(null);
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;
    const viewRef = useRef<ViewInstance>(null);
    const centerRef = useRef({ x: 0, y: 0 });

    const refs = useRef({
        minutes,
        seconds,
        onChange,
        min,
    });
    refs.current = { minutes, seconds, onChange, min };

    const emit = (nextMinutes: number, nextSeconds: number) => {
        refs.current.onChange?.(Math.max((nextMinutes * 60 + nextSeconds) * 1000, refs.current.min));
    };

    const measureCenter = () => {
        viewRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            centerRef.current = { x: pageX + width / 2, y: pageY + height / 2 };
        });
    };

    const handleInteraction = (pageX: number, pageY: number) => {
        if (disabledRef.current || activeHandRef.current === null) {
            return;
        }
        const dx = pageX - centerRef.current.x;
        const dy = pageY - centerRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
            return;
        }
        const snapped = snapSlice(svgAtan2ToClockAngle(dx, dy), 0, 360, STEP_DEG);
        const ticks = clockDegreesToTicks(snapped);
        if (activeHandRef.current === 'seconds') {
            emit(refs.current.minutes, ticks);
        } else {
            emit(ticks, refs.current.seconds);
        }
    };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: (evt) => {
            if (disabledRef.current) {
                return;
            }
            measureCenter();
            const { pageX, pageY } = evt.nativeEvent;
            const dx = pageX - centerRef.current.x;
            const dy = pageY - centerRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            activeHandRef.current =
                Math.abs(dist - secondsRadius) <= Math.abs(dist - minutesRadius) ? 'seconds' : 'minutes';
            setActiveHand(activeHandRef.current);
            handleInteraction(pageX, pageY);
        },
        onPanResponderMove: (evt) => handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY),
        onPanResponderRelease: () => { activeHandRef.current = null; setActiveHand(null); },
        onPanResponderTerminate: () => { activeHandRef.current = null; setActiveHand(null); },
    }), [secondsRadius, minutesRadius]);

    const clock = (
        <View
            ref={viewRef}
            style={styles.container}
            collapsable={false}
            {...panResponder.panHandlers}
        >
            <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <ClockDial
                    center={center}
                    outerRadius={outerRadius}
                    strokeWidth={strokeWidth}
                    min={0}
                    max={360}
                    color={color}
                    variant={variant}
                    isFullCircle
                />
                <ClockTicks
                    center={center}
                    outerRadius={outerRadius}
                    size={size}
                    strokeWidth={strokeWidth}
                    min={0}
                    max={360}
                    color={color}
                    variant={variant}
                />
                <ClockPointer
                    center={center}
                    pointerX={minutesPointer.x}
                    pointerY={minutesPointer.y}
                    strokeWidth={strokeWidth * 0.8}
                    isDragging={activeHand === 'minutes'}
                    centerDotRadius={centerDotRadii[size]}
                    color={color}
                    activeHighlight={activeHighlight}
                    variant={variant}
                />
                <ClockThumb
                    center={center}
                    pointerX={minutesPointer.x}
                    pointerY={minutesPointer.y}
                    thumbRadius={thumbRadii[size]}
                    strokeWidth={strokeWidth}
                    color={color}
                    variant={variant}
                />
                <ClockPointer
                    center={center}
                    pointerX={secondsPointer.x}
                    pointerY={secondsPointer.y}
                    strokeWidth={strokeWidth}
                    isDragging={activeHand === 'seconds'}
                    centerDotRadius={centerDotRadii[size]}
                    color={color}
                    activeHighlight={activeHighlight}
                    variant={variant}
                />
                <ClockThumb
                    center={center}
                    pointerX={secondsPointer.x}
                    pointerY={secondsPointer.y}
                    thumbRadius={thumbRadii[size]}
                    strokeWidth={strokeWidth}
                    color={color}
                    variant={variant}
                />
            </Svg>
        </View>
    );
    const steppedClock = showStepControls ? (
        <View style={{ width: stepControlsWidth }}>
            <StepControls color={color} size={size} value={value} onChange={onChange} min={min} step={step} disabled={disabled} ariaLabel={ariaLabel}>
                {clock}
            </StepControls>
        </View>
    ) : clock;
    const isVerticalNumberInput = numberInputPlacement === 'above' || numberInputPlacement === 'below';

    return (
        <View style={[styles.control, {
            flexDirection: !showNumberInput ? 'row' : numberInputPlacement === 'start' ? 'row-reverse' : numberInputPlacement === 'above' ? 'column-reverse' : numberInputPlacement === 'below' ? 'column' : 'row',
        }, style]}>
            {steppedClock}
            {showNumberInput ? (
                <View style={[styles.numberInputs, isVerticalNumberInput ? styles.verticalNumberInputs : styles.horizontalNumberInputs]}>
                    <View style={styles.numberInput}>
                        <NumberInput value={minutes} onChange={(newMinutes) => emit(newMinutes, seconds)} min={0} step={1} color={color} highlightColor={highlightColor} size={size} variant={variant} disabled={disabled || !onChange} showStepControls ariaLabel={`${ariaLabel ?? 'Duration'} (minutes)`} unit="min" />
                    </View>
                    <View style={styles.numberInput}>
                        <NumberInput value={seconds} onChange={(newSeconds) => emit(minutes, newSeconds)} min={0} max={59} step={1} color={color} highlightColor={highlightColor} size={size} variant={variant} disabled={disabled || !onChange} showStepControls ariaLabel={`${ariaLabel ?? 'Duration'} (seconds)`} unit="s" />
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    control: {
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        gap: 8,
    },
    numberInputs: {
        flexDirection: 'row',
        gap: 8,
    },
    horizontalNumberInputs: {
        flex: 1,
    },
    verticalNumberInputs: {
        width: '100%',
    },
    numberInput: {
        flex: 1,
        minWidth: 0,
    },
});
