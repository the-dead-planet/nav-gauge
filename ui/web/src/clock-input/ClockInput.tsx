import { ComponentProps, FC, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ClockInputProps, useTheme, TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, snapSlice, clockAngleToRadians, svgAtan2ToClockAngle, describeArc, CLOCK_INPUT_RANGE } from "@ui";
import { Label, Span } from "../typography";
import styles from './clock-input.module.css';

const sizeMap: Record<string, number> = { xs: 45, sm: 60, md: 75 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2, md: 2.5 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
const paddings: Record<string, number> = { xs: 6, sm: 6, md: 7 };
const tickMajorLengths: Record<string, number> = { xs: 4, sm: 5, md: 6 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 2.5, md: 3 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };

export const ClockInput: FC<ClockInputProps & Omit<ComponentProps<'div'>, 'onChange' | 'value'>> = ({
    id,
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    value = CLOCK_INPUT_RANGE[0],
    min = CLOCK_INPUT_RANGE[0],
    max = CLOCK_INPUT_RANGE[1],
    step = STEP_DEG,
    onChange,
    label,
    disabled = false,
    className,
    ...props
}) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const padding = paddings[size];
    const outerRadius = center - padding;
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];
    const isFullCircle = max - min >= 360;

    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const isDraggingRef = useRef(false);
    const valueRef = useRef(value);
    valueRef.current = value;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;
    const centerRef = useRef({ x: 0, y: 0 });

    const handleInteraction = useCallback((clientX: number, clientY: number) => {
        if (disabledRef.current) {
            return;
        }

        const { x: cx, y: cy } = centerRef.current;
        const dx = clientX - cx;
        const dy = clientY - cy;
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

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
        e.preventDefault();
        const rect = svgRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        isDraggingRef.current = true;
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY);
    }, [handleInteraction]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
        const rect = svgRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        isDraggingRef.current = true;
        setIsDragging(true);
        const t = e.touches[0];
        handleInteraction(t.clientX, t.clientY);
    }, [handleInteraction]);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) {
                return;
            }
            e.preventDefault();
            handleInteraction(e.clientX, e.clientY);
        };

        const handleGlobalMouseUp = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isDraggingRef.current) {
                return;
            }
            e.preventDefault();
            const t = e.touches[0];
            handleInteraction(t.clientX, t.clientY);
        };

        const handleGlobalTouchEnd = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
        window.addEventListener('touchend', handleGlobalTouchEnd);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, [handleInteraction]);

    const pointerRad = clockAngleToRadians(value);
    const pointerLen = outerRadius - 3;
    const pointerX = Math.cos(pointerRad) * pointerLen;
    const pointerY = Math.sin(pointerRad) * pointerLen;

    return (
        <div
            className={classNames(
                styles.container,
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${activeHighlight}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                { [styles.disabled]: disabled },
                className
            )}
            {...props}
        >
            <input
                type="range"
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
                disabled={disabled}
                className={styles['a11y-slider']}
                aria-label={label || 'Angle'}
                tabIndex={0}
            />
            {label && (
                <Label htmlFor={id} className={styles['label']}>
                    {label}
                    <Span tabular>{value}°</Span>
                </Label>
            )}
            <svg
                ref={svgRef}
                width={svgSize}
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className={classNames(
                    styles.svg,
                    { [styles['svg-dragging']]: isDragging }
                )}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                aria-hidden="true"
            >
                <circle
                    cx={center}
                    cy={center}
                    r={outerRadius + strokeWidth}
                    className={styles['bg-circle']}
                />
                {isFullCircle ? (
                    <circle
                        cx={center}
                        cy={center}
                        r={outerRadius}
                        fill="none"
                        className={styles.dial}
                        strokeWidth={strokeWidth}
                    />
                ) : (
                    <path
                        d={describeArc(center, center, outerRadius, min, max)}
                        fill="none"
                        className={styles.dial}
                        strokeWidth={strokeWidth}
                    />
                )}

                {Array.from({ length: TICK_COUNT }, (_, i) => {
                    const angleDeg = i * STEP_DEG;
                    if (!isFullCircle && (angleDeg < min || angleDeg > max)) return null;
                    const isMajor = i % MAJOR_TICK_INTERVAL === 0;
                    const tickLen = isMajor
                        ? tickMajorLengths[size]
                        : tickMinorLengths[size];
                    const tickWidth = isMajor ? strokeWidth : strokeWidth * 0.6;
                    const rad = clockAngleToRadians(angleDeg);
                    const innerR = outerRadius - tickLen;
                    const x1 = center + Math.cos(rad) * innerR;
                    const y1 = center + Math.sin(rad) * innerR;
                    const x2 = center + Math.cos(rad) * outerRadius;
                    const y2 = center + Math.sin(rad) * outerRadius;
                    
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            strokeWidth={tickWidth}
                            className={classNames(
                                styles.tick,
                                isMajor ? styles['tick-major'] : styles['tick-minor']
                            )}
                            strokeLinecap="round"
                        />
                    );
                })}

                <line
                    x1={center}
                    y1={center}
                    x2={center + pointerX}
                    y2={center + pointerY}
                    className={classNames(
                        styles.pointer,
                        { [styles['pointer-active']]: isDragging }
                    )}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                <circle
                    cx={center}
                    cy={center}
                    r={centerDotRadius}
                    className={styles['center-dot']}
                />

                <circle
                    cx={center + pointerX}
                    cy={center + pointerY}
                    r={thumbRadius}
                    className={classNames(
                        styles.thumb,
                        { [styles['thumb-active']]: isDragging }
                    )}
                    strokeWidth={strokeWidth}
                />
            </svg>
        </div>
    );
};
