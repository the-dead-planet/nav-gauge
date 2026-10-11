import { FC, useRef, useState } from "react";
import classNames from "classnames";
import { ResizeHandleGrip } from "./ResizeHandleGrip";
import { ResizeHandleProps, useTheme } from "@ui";
import styles from './resize-handle.module.css';
import { Tooltip } from "../tooltip";

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    side,
    color = 'neutral',
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
    tooltip,
}) => {
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    const handlePointerDown = (e: React.PointerEvent) => {
        if (disabled) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.(direction === 'horizontal' ? e.clientX : e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!lastPositionRef.current) {
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
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
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
            style={{
                '--handle-color': theme.color(color, 500, color === 'neutral' ? 0.4 : 1),
            } as React.CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
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
            aria-label={typeof tooltip === 'string' ? tooltip : undefined}
            tabIndex={disabled ? undefined : 0}
        >
            <div className={styles['border']} />
            {[25, 75].map((position) => (
                <ResizeHandleGrip
                    key={position}
                    position={position}
                    isDragging={isDragging}
                    color={color}
                    direction={direction}
                    side={side}
                />
            ))}
        </div>
    );

    return <Tooltip content={tooltip} color="secondary" placement={gripSide}>{handle}</Tooltip>;
};
