import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { IconRotateInputProps, useTheme } from "@ui";
import { RotationArrows } from "./RotationArrows";
import { RotateIconWrapper } from "./RotateIconWrapper";
import { RotateA11yInput } from "./RotateA11yInput";
import styles from './icon-rotate-input.module.css';

const sizeMap: Record<string, number> = { xs: 36, sm: 48, md: 60 };
const iconSizes: Record<string, number> = { xs: 12, sm: 20, md: 32 };

export const IconRotateInput: FC<IconRotateInputProps & Omit<ComponentProps<'div'>, 'onChange' | 'value'>> = ({
    icon,
    angle = 0,
    onAngleChange,
    color = 'neutral',
    highlightColor,
    size = 'sm',
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    id,
    label,
    className,
    ...props
}) => {
    const theme = useTheme();
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - 4;
    const iconSize = iconSizes[size];

    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [displayAngle, setDisplayAngle] = useState(angle);
    const [displayWrapped, setDisplayWrapped] = useState(angle);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const angleRef = useRef(angle);
    angleRef.current = angle;
    const onAngleChangeRef = useRef(onAngleChange);
    onAngleChangeRef.current = onAngleChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;
    const centerRef = useRef({ x: 0, y: 0 });
    const prevMouseAngleRef = useRef(0);
    const displayAngleRef = useRef(angle);
    displayAngleRef.current = displayAngle;

    if (!isDragging && angle !== angleRef.current) {
        setDisplayAngle(angle);
        setDisplayWrapped(angle);
    }

    const snapAngle = (raw: number): number => {
        if (max - min >= 360) {
            const stepped = Math.round(raw / step) * step;
            return ((stepped % 360) + 360) % 360;
        }
        const stepped = Math.round((raw - min) / step) * step + min;
        return Math.min(max, Math.max(min, stepped));
    };

    const mouseToClockAngle = (clientX: number, clientY: number): number => {
        const { x: cx, y: cy } = centerRef.current;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const svgDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        return ((svgDeg + 90) % 360 + 360) % 360;
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (disabledRef.current) {
            return;
        }
        const currentMouseAngle = mouseToClockAngle(clientX, clientY);
        let delta = currentMouseAngle - prevMouseAngleRef.current;
        if (delta > 180) {
            delta -= 360;
        }
        if (delta < -180) {
            delta += 360;
        }
        prevMouseAngleRef.current = currentMouseAngle;
        const newDisplay = displayAngleRef.current + delta;
        const wrapped = snapAngle(newDisplay);
        displayAngleRef.current = newDisplay;
        setDisplayAngle(newDisplay);
        if (wrapped !== angleRef.current) {
            angleRef.current = wrapped;
            setDisplayWrapped(wrapped);
            onAngleChangeRef.current?.(wrapped);
        }
    };

    const handleDragStart = (clientX: number, clientY: number) => {
        if (disabledRef.current || !containerRef.current) {
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        prevMouseAngleRef.current = mouseToClockAngle(clientX, clientY);
        isDraggingRef.current = true;
        setIsDragging(true);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        handleDragStart(t.clientX, t.clientY);
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) {
                return;
            }
            e.preventDefault();
            handleDragMove(e.clientX, e.clientY);
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
            handleDragMove(t.clientX, t.clientY);
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
    }, [handleDragMove]);

    const activeHighlight = highlightColor || color;
    const isLight = theme.mode === 'light';

    const iconColor = (() => {
        if (isDragging || isHovering) {
            return theme.color(activeHighlight, isLight ? 600 : 300);
        }
        return theme.color(color, 500);
    })();

    return (
        <div
            className={classNames(
                styles.container,
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${activeHighlight}`],
                styles[`size-${size}`],
                {
                    [styles.disabled]: disabled,
                    [styles['container-dragging']]: isDragging,
                },
                className
            )}
        >
            <RotateA11yInput
                id={id}
                min={min}
                max={max}
                step={step}
                value={displayWrapped}
                onChange={onAngleChange}
                onSync={(newValue) => {
                    setDisplayAngle(newValue);
                    setDisplayWrapped(newValue);
                }}
                disabled={disabled}
                label={label}
            />

            <div
                ref={containerRef}
                className={styles['visual-container']}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                {...props}
            >
                <RotationArrows
                    svgSize={svgSize}
                    center={center}
                    outerRadius={outerRadius}
                />

                <RotateIconWrapper
                    icon={icon}
                    iconSize={iconSize}
                    displayAngle={displayAngle}
                    iconColor={iconColor}
                />
            </div>
        </div>
    );
};
