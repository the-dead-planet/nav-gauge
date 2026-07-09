import { ComponentProps, FC, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ClockInputProps, useTheme, TICK_COUNT, STEP_DEG, MAJOR_TICK_INTERVAL, snapSlice, clockAngleToRadians, svgAtan2ToClockAngle, describeArc, arcViewBox } from "@ui";
import styles from './clock-input.module.css';
import { Label, Span } from "../typography";

const sizeMap: Record<string, number> = { xs: 45, sm: 60, md: 75 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2, md: 2.5 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
const tickMajorLengths: Record<string, number> = { xs: 4, sm: 5, md: 6 };
const tickMinorLengths: Record<string, number> = { xs: 2, sm: 2.5, md: 3 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };

export const ClockSliceInput: FC<ClockInputProps & Omit<ComponentProps<'div'>, 'onChange' | 'value'>> = ({
    id,
    color = 'neutral',
    highlightColor,
    size = 'sm',
    value = 0,
    min = 0,
    max = 85,
    step = 1,
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
    const outerRadius = center - 4;
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];

    const arcStartAngle = min;
    const arcEndAngle = max;

    const vb = arcViewBox(center, center, outerRadius + strokeWidth, arcStartAngle, arcEndAngle, true, 2);

    const pointerRad = clockAngleToRadians(value);
    const pointerLen = outerRadius - 3;
    const pointerX = Math.cos(pointerRad) * pointerLen;
    const pointerY = Math.sin(pointerRad) * pointerLen;

    const startRad = clockAngleToRadians(arcStartAngle);
    const endRad = clockAngleToRadians(arcEndAngle);
    const arcStartX = center + outerRadius * Math.cos(startRad);
    const arcStartY = center + outerRadius * Math.sin(startRad);
    const arcEndX = center + outerRadius * Math.cos(endRad);
    const arcEndY = center + outerRadius * Math.sin(endRad);
    const arcSweep = ((arcEndAngle - arcStartAngle) % 360 + 360) % 360;
    const wedgePath = `M ${center} ${center} L ${arcStartX} ${arcStartY} A ${outerRadius} ${outerRadius} 0 ${arcSweep > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY} Z`;

    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const isDraggingRef = useRef(false);
    const valueRef = useRef(value);
    valueRef.current = value;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    function screenToSvg(clientX: number, clientY: number): { x: number; y: number } | null {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        const scaleX = rect.width / vb.width;
        const scaleY = rect.height / vb.height;
        return {
            x: vb.x + (clientX - rect.left) / scaleX,
            y: vb.y + (clientY - rect.top) / scaleY,
        };
    }

    const handleInteraction = useCallback((clientX: number, clientY: number) => {
        if (disabledRef.current) {
            return;
        }
        const pt = screenToSvg(clientX, clientY);
        if (!pt) {
            return;
        }
        const dx = pt.x - center;
        const dy = pt.y - center;
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
    }, [min, max, step, vb, center]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
        e.preventDefault();
        isDraggingRef.current = true;
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY);
    }, [handleInteraction]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
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

    return (
        <div
            className={classNames(
                styles.container,
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${activeHighlight}`],
                styles[`size-${size}`],
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
                viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
                className={classNames(
                    styles.svg,
                    { [styles['svg-dragging']]: isDragging }
                )}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                aria-hidden="true"
            >
                <path
                    d={wedgePath}
                    fill="var(--angle-color)"
                    fillOpacity={0.12}
                />
                <path
                    d={describeArc(center, center, outerRadius, arcStartAngle, arcEndAngle)}
                    fill="none"
                    className={styles.dial}
                    strokeWidth={strokeWidth}
                />
                {Array.from({ length: TICK_COUNT }, (_, i) => {
                    const angleDeg = i * STEP_DEG;
                    if (angleDeg < arcStartAngle || angleDeg > arcEndAngle) return null;
                    const isMajor = i % MAJOR_TICK_INTERVAL === 0;
                    const tickLen = isMajor ? tickMajorLengths[size] : tickMinorLengths[size];
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
