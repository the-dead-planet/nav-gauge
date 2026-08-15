import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import { ClockInputProps, useTheme, STEP_DEG, snapSlice, pointerCoords, svgAtan2ToClockAngle, CLOCK_INPUT_RANGE } from "@ui";
import styles from './clock-input.module.css';
import { ClockSvg } from "./ClockSvg";
import { ClockA11yInput } from "./ClockA11yInput";
import { ClockContainer } from "./ClockContainer";

const sizeMap: Record<string, number> = { xs: 45, sm: 60, md: 75 };
const thumbRadii: Record<string, number> = { xs: 1.5, sm: 2, md: 2.5 };
const centerDotRadii: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };
const paddings: Record<string, number> = { xs: 6, sm: 6, md: 7 };
const strokeWidths: Record<string, number> = { xs: 0.75, sm: 1, md: 1.25 };

export const ClockInput: FC<ClockInputProps & Omit<ComponentProps<'div'>, 'onChange' | 'value'>> = ({
    id,
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    value = CLOCK_INPUT_RANGE[0],
    formatValue,
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
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const padding = paddings[size];
    const outerRadius = center - padding;
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

    const handleInteraction = (clientX: number, clientY: number) => {
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
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
        e.preventDefault();
        const rect = svgRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        isDraggingRef.current = true;
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabledRef.current || !svgRef.current) {
            return;
        }
        const rect = svgRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        isDraggingRef.current = true;
        setIsDragging(true);
        const t = e.touches[0];
        handleInteraction(t.clientX, t.clientY);
    };

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

    const { x: pointerX, y: pointerY } = pointerCoords(value, outerRadius);

    return (
        <ClockContainer
            mode={theme.mode}
            color={color}
            highlightColor={highlightColor}
            size={size}
            variant={variant}
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
                formatValue={formatValue}
                onChange={onChange}
                onSync={onChange}
                disabled={disabled}
                label={label}
            />
            <ClockSvg
                svgSize={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
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
                thumbRadius={thumbRadii[size]}
                min={min}
                max={max}
                size={size}
                isFullCircle={isFullCircle}
            >
                <circle
                    cx={center}
                    cy={center}
                    r={outerRadius + strokeWidth}
                    className={styles['bg-circle']}
                />
            </ClockSvg>
        </ClockContainer>
    );
};
