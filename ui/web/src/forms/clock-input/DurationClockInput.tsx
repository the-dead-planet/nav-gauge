import { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
    DurationClockInputProps,
    millisecondsToDurationParts,
    ticksToClockDegrees,
    clockDegreesToTicks,
    pointerCoords,
    svgAtan2ToClockAngle,
    snapSlice,
    STEP_DEG,
    useTheme,
} from "@ui";
import { ClockContainer } from "./ClockContainer";
import { ClockDial } from "./ClockDial";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from './clock-input.module.css';

const sizeMap: Record<string, number> = { xs: 45, sm: 60, md: 75 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2, md: 2.5 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
const paddings: Record<string, number> = { xs: 6, sm: 6, md: 7 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
const MINUTES_HAND_FRACTION = 0.55;

type Hand = 'minutes' | 'seconds';

export const DurationClockInput: FC<DurationClockInputProps & { id?: string; className?: string }> = ({
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    value,
    min = 0,
    step = 1000,
    onChange,
    disabled = false,
    showNumberInput = false,
    showStepControls = false,
    numberInputPlacement = 'end',
    ariaLabel,
    className,
}) => {
    const theme = useTheme();
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
    const centerRef = useRef({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const emit = (nextMinutes: number, nextSeconds: number) => {
        onChange?.(Math.max((nextMinutes * 60 + nextSeconds) * 1000, min));
    };

    const handleAngle = (clientX: number, clientY: number) => {
        if (disabled || activeHand === null) {
            return;
        }
        const { x: cx, y: cy } = centerRef.current;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
            return;
        }
        const snapped = snapSlice(svgAtan2ToClockAngle(dx, dy), 0, 360, STEP_DEG);
        const ticks = clockDegreesToTicks(snapped);
        if (activeHand === 'seconds') {
            emit(minutes, ticks);
        } else {
            emit(ticks, seconds);
        }
    };

    const beginHand = (clientX: number, clientY: number) => {
        if (disabled || !svgRef.current) {
            return;
        }
        const rect = svgRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const dx = clientX - centerRef.current.x;
        const dy = clientY - centerRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setActiveHand(
            Math.abs(dist - secondsRadius) <= Math.abs(dist - minutesRadius) ? 'seconds' : 'minutes'
        );
        handleAngle(clientX, clientY);
    };

    useEffect(() => {
        const move = (e: MouseEvent | TouchEvent) => {
            const p = 'touches' in e ? e.touches[0] : e;
            handleAngle(p.clientX, p.clientY);
        };
        const end = () => setActiveHand(null);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', end);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', end);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, minutes, seconds, activeHand]);

    const clock = (
        <svg
            ref={svgRef}
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className={styles.svg}
            aria-hidden="true"
            onMouseDown={(event) => { event.preventDefault(); beginHand(event.clientX, event.clientY); }}
            onTouchStart={(event) => { const touch = event.touches[0]; beginHand(touch.clientX, touch.clientY); }}
        >
            <circle cx={center} cy={center} r={outerRadius + strokeWidth} className={styles['bg-circle']} />
            <ClockDial center={center} outerRadius={outerRadius} strokeWidth={strokeWidth} min={0} max={360} isFullCircle />
            <ClockTicks center={center} outerRadius={outerRadius} size={size} strokeWidth={strokeWidth} min={0} max={360} />
            <ClockPointer center={center} pointerX={minutesPointer.x} pointerY={minutesPointer.y} strokeWidth={strokeWidth * 0.8} isDragging={activeHand === 'minutes'} centerDotRadius={centerDotRadii[size]} />
            <ClockThumb center={center} pointerX={minutesPointer.x} pointerY={minutesPointer.y} thumbRadius={thumbRadii[size]} isDragging={activeHand === 'minutes'} strokeWidth={strokeWidth} />
            <ClockPointer center={center} pointerX={secondsPointer.x} pointerY={secondsPointer.y} strokeWidth={strokeWidth} isDragging={activeHand === 'seconds'} centerDotRadius={centerDotRadii[size]} />
            <ClockThumb center={center} pointerX={secondsPointer.x} pointerY={secondsPointer.y} thumbRadius={thumbRadii[size]} isDragging={activeHand === 'seconds'} strokeWidth={strokeWidth} />
        </svg>
    );
    const steppedClock = showStepControls ? (
        <StepControls
            color={color}
            variant={variant}
            size={size}
            value={value}
            onChange={onChange}
            min={min}
            step={step}
            disabled={disabled}
            ariaLabel={ariaLabel}
        >
            {clock}
        </StepControls>
    ) : clock;

    return (
        <ClockContainer
            mode={theme.mode}
            color={color}
            highlightColor={highlightColor}
            size={size}
            variant={variant}
            disabled={disabled}
            className={classNames(styles['duration-container'], className)}
        >
            <div className={classNames(styles['control-row'], showNumberInput && styles[`number-input-${numberInputPlacement}`])}>
                {steppedClock}
                {showNumberInput ? (
                    <div className={styles['duration-number-inputs']}>
                        <NumberInput value={minutes} onChange={(newMinutes) => emit(newMinutes, seconds)} min={0} step={1} color={color} highlightColor={highlightColor} size={size} variant={variant} disabled={disabled || !onChange} showStepControls ariaLabel={`${ariaLabel ?? 'Duration'} (minutes)`} unit="min" />
                        <NumberInput value={seconds} onChange={(newSeconds) => emit(minutes, newSeconds)} min={0} max={59} step={1} color={color} highlightColor={highlightColor} size={size} variant={variant} disabled={disabled || !onChange} showStepControls ariaLabel={`${ariaLabel ?? 'Duration'} (seconds)`} unit="s" />
                    </div>
                ) : null}
            </div>
        </ClockContainer>
    );
};
