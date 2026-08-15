import { FC, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { ResizeHandleProps } from "@ui";
import styles from './resize-handle.module.css';

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (disabled) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.(direction === 'horizontal' ? e.clientX : e.clientY);
    }, [disabled, onDragStart, direction]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
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
    }, [direction, onDrag]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!lastPositionRef.current) {
            return;
        }
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        lastPositionRef.current = null;
        setIsDragging(false);
        onDragEnd?.();
    }, [onDragEnd]);

    return (
        <div
            className={classNames(
                styles['handle'],
                { [styles['handle-vertical']]: direction === 'vertical' },
                { [styles['dragging']]: isDragging },
                { [styles['disabled']]: disabled },
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className={styles['border']} />
        </div>
    );
};
