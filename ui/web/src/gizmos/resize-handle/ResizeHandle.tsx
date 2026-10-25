import { FC, useRef, useState } from "react";
import classNames from "classnames";
import { ResizeHandleGrip } from "./ResizeHandleGrip";
import { DEFAULT_COLOR, ResizeHandleProps } from "@ui";
import styles from './resize-handle.module.css';
import { Tooltip } from "../tooltip";

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    side,
    color = DEFAULT_COLOR,
    highlightColor,
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
    tooltip,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    const handlePointerDown = (e: React.PointerEvent) => {
        if (disabled) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.(direction === 'horizontal' ? e.clientX : e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!lastPositionRef.current || disabled) {
            return;
        }
        const delta = direction === 'horizontal'
            ? e.clientX - lastPositionRef.current.x
            : e.clientY - lastPositionRef.current.y;
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        if (delta !== 0) {
            onDrag(delta);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!lastPositionRef.current) {
            return;
        }
        e.currentTarget.releasePointerCapture(e.pointerId);
        lastPositionRef.current = null;
        setIsDragging(false);
        onDragEnd?.();
    };

    const handle = (
        <div
            className={classNames(
                styles['handle'],
                { [styles['handle-vertical']]: direction === 'vertical' },
                { [styles['dragging']]: isDragging },
                { [styles['disabled']]: disabled },
            )}
            data-appearance-variant="default"
            data-appearance-color={color}
            data-appearance-highlight={highlightColor ?? color}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={() => {
                if (lastPositionRef.current) {
                    lastPositionRef.current = null;
                    setIsDragging(false);
                    onDragEnd?.();
                }
            }}
            onKeyDown={(event) => {
                const delta = direction === 'horizontal'
                    ? event.key === 'ArrowLeft' ? -10 : event.key === 'ArrowRight' ? 10 : 0
                    : event.key === 'ArrowUp' ? -10 : event.key === 'ArrowDown' ? 10 : 0;
                if (delta !== 0 && !disabled) {
                    event.preventDefault();
                    onDragStart?.(0);
                    onDrag(delta);
                    onDragEnd?.();
                }
            }}
            role="separator"
            aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
            aria-disabled={disabled || undefined}
            aria-label={typeof tooltip === 'string' ? tooltip : undefined}
            tabIndex={disabled ? undefined : 0}
        >
            <div className={styles['border']} />
            {[25, 75].map((position) => (
                <ResizeHandleGrip
                    key={position}
                    position={position}
                    direction={direction}
                    side={side}
                />
            ))}
        </div>
    );

    return <Tooltip content={tooltip} color={highlightColor ?? color} placement={gripSide}>{handle}</Tooltip>;
};
