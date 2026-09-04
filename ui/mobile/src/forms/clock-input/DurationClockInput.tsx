import { FC, useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, View, ViewStyle } from "react-native";
import Svg from "react-native-svg";
import {
    DurationClockInputProps,
    useTheme,
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

const paddings: Record<string, number> = { xs: 7, sm: 8, md: 9 };
const MINUTES_HAND_FRACTION = 0.55;

type Hand = 'minutes' | 'seconds';

export const DurationClockInput: FC<DurationClockInputProps & { style?: ViewStyle }> = ({
    color = 'neutral',
    highlightColor,
    size = 'md',
    variant = 'fill-translucent',
    value,
    min = 0,
    onChange,
    disabled = false,
    style,
}) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - paddings[size];
    const strokeWidth = strokeWidths[size];
    const secondsRadius = outerRadius;
    const minutesRadius = outerRadius * MINUTES_HAND_FRACTION;

    const { minutes, seconds } = millisecondsToDurationParts(value);
    const secondsPointer = pointerCoords(ticksToClockDegrees(seconds), secondsRadius);
    const minutesPointer = pointerCoords(ticksToClockDegrees(minutes), minutesRadius);

    const [activeHand, setActiveHand] = useState<Hand | null>(null);
    const activeHandRef = useRef<Hand | null>(null);
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

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

    const handleInteraction = (locationX: number, locationY: number) => {
        if (disabledRef.current || activeHandRef.current === null) {
            return;
        }
        const dx = locationX - center;
        const dy = locationY - center;
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
            const { locationX, locationY } = evt.nativeEvent;
            const dx = locationX - center;
            const dy = locationY - center;
            const dist = Math.sqrt(dx * dx + dy * dy);
            activeHandRef.current =
                Math.abs(dist - secondsRadius) <= Math.abs(dist - minutesRadius) ? 'seconds' : 'minutes';
            setActiveHand(activeHandRef.current);
            handleInteraction(locationX, locationY);
        },
        onPanResponderMove: (evt) => handleInteraction(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onPanResponderRelease: () => { activeHandRef.current = null; setActiveHand(null); },
        onPanResponderTerminate: () => { activeHandRef.current = null; setActiveHand(null); },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [secondsRadius, minutesRadius]);

    return (
        <View
            style={[styles.container, style]}
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
                    isLight={theme.isLight}
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
                    activeHighlight={activeHighlight}
                    variant={variant}
                    isLight={theme.isLight}
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
                    isLight={theme.isLight}
                />
                <ClockThumb
                    center={center}
                    pointerX={minutesPointer.x}
                    pointerY={minutesPointer.y}
                    thumbRadius={thumbRadii[size]}
                    isDragging={activeHand === 'minutes'}
                    strokeWidth={strokeWidth}
                    color={color}
                    activeHighlight={activeHighlight}
                    variant={variant}
                    isLight={theme.isLight}
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
                    isLight={theme.isLight}
                />
                <ClockThumb
                    center={center}
                    pointerX={secondsPointer.x}
                    pointerY={secondsPointer.y}
                    thumbRadius={thumbRadii[size]}
                    isDragging={activeHand === 'seconds'}
                    strokeWidth={strokeWidth}
                    color={color}
                    activeHighlight={activeHighlight}
                    variant={variant}
                    isLight={theme.isLight}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});
