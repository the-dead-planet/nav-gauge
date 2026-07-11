import { ComponentProps, FC, useCallback, useEffect, useRef, useState } from "react";
import { ClockInputProps, useTheme, snapSlice, clockAngleToRadians, pointerCoords, svgAtan2ToClockAngle, arcViewBox } from "@ui";
import { ClockSvg } from "./ClockSvg";
import { ClockA11yInput } from "./ClockA11yInput";
import { ClockContainer } from "./ClockContainer";
import styles from './clock-input.module.css';

const sizeMap: Record<string, number> = { xs: 45, sm: 60, md: 75 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2, md: 2.5 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
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
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - 4;
    const thumbRadius = thumbRadii[size];
    const centerDotRadius = centerDotRadii[size];
    const strokeWidth = strokeWidths[size];

    const arcStartAngle = min;
    const arcEndAngle = max;

    const vb = arcViewBox(center, center, outerRadius + strokeWidth, arcStartAngle, arcEndAngle, true, 2);

    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

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
        <ClockContainer
            mode={theme.mode}
            color={color}
            highlightColor={highlightColor}
            size={size}
            disabled={disabled}
            className={className}
            {...props}
        >
            <ClockA11yInput
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                onSync={onChange}
                disabled={disabled}
                label={label}
            />
            <ClockSvg
                svgSize={svgSize}
                viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
                svgRef={svgRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                isDragging={isDragging}
                center={center}
                outerRadius={outerRadius}
                strokeWidth={strokeWidth}
                pointerX={pointerX}
                pointerY={pointerY}
                centerDotRadius={centerDotRadius}
                thumbRadius={thumbRadius}
                min={arcStartAngle}
                max={arcEndAngle}
                size={size}
            >
                <path
                    d={wedgePath}
                    className={styles['wedge']}
                />
            </ClockSvg>
        </ClockContainer>
    );
};
