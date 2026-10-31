import { PointerEvent, useEffect, useRef, useState } from "react";
import {
    ClockHand,
    ClockMode,
    clockValueFromAngle,
    MINUTES_HAND_FRACTION,
    svgAtan2ToClockAngle,
} from "@ui";

interface Options {
    mode: ClockMode;
    value: number;
    min: number;
    max: number;
    step: number;
    center: number;
    outerRadius: number;
    disabled: boolean;
    onChange?: (value: number) => void;
}

export const useClockDrag = ({
    mode,
    value,
    min,
    max,
    step,
    center,
    outerRadius,
    disabled,
    onChange,
}: Options) => {
    const [dragging, setDragging] = useState(false);
    const pointer = useRef<{ id: number; hand: ClockHand } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (disabled) {
            pointer.current = null;
            setDragging(false);
        }
    }, [disabled]);

    const update = (event: PointerEvent<SVGSVGElement>, starting: boolean) => {
        if (
            disabled ||
            (!starting && pointer.current?.id !== event.pointerId)
        ) {
            return;
        }
        const matrix = event.currentTarget.getScreenCTM();
        if (!matrix) {
            return;
        }
        const point = event.currentTarget.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(matrix.inverse());
        const horizontal = local.x - center;
        const vertical = local.y - center;
        const distance = Math.hypot(horizontal, vertical);
        if (starting) {
            const hand: ClockHand =
                mode !== "duration"
                    ? "angle"
                    : Math.abs(distance - outerRadius) <=
                        Math.abs(distance - outerRadius * MINUTES_HAND_FRACTION)
                      ? "seconds"
                      : "minutes";
            pointer.current = { id: event.pointerId, hand };
            event.currentTarget.setPointerCapture(event.pointerId);
            inputRef.current?.focus();
            setDragging(true);
        }
        if (distance < 4 || !pointer.current) {
            return;
        }
        const next = clockValueFromAngle(
            value,
            svgAtan2ToClockAngle(horizontal, vertical),
            pointer.current.hand,
            min,
            max,
            step,
        );
        if (next !== value) {
            onChange?.(next);
        }
    };

    const end = () => {
        pointer.current = null;
        setDragging(false);
    };

    return {
        dragging: dragging && !disabled,
        inputRef,
        pointerEvents: {
            onPointerDown: (event: PointerEvent<SVGSVGElement>) => {
                if (event.button === 0 && !pointer.current) {
                    event.preventDefault();
                    update(event, true);
                }
            },
            onPointerMove: (event: PointerEvent<SVGSVGElement>) =>
                update(event, false),
            onPointerUp: end,
            onPointerCancel: end,
            onLostPointerCapture: end,
        },
    };
};
