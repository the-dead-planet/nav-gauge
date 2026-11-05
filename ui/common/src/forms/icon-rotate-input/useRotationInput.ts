import { useRef, useState } from "react";
import { IconRotateInputProps } from "./model";
import { snapRotation } from "./tinkers";

export const useRotationInput = ({
    value,
    onChange,
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
}: Pick<
    IconRotateInputProps,
    "value" | "onChange" | "min" | "max" | "step" | "disabled"
>) => {
    const [dragAngle, setDragAngle] = useState<number>();
    const drag = useRef<{ pointerAngle: number; angle: number }>(undefined);
    const inactive = disabled || !onChange;
    const start = (pointerAngle: number) => {
        if (inactive) {
            return;
        }
        drag.current = { pointerAngle, angle: value };
        setDragAngle(value);
    };
    const move = (pointerAngle: number) => {
        if (inactive || !drag.current) {
            return;
        }
        const delta =
            ((pointerAngle - drag.current.pointerAngle + 540) % 360) - 180;
        const angle = drag.current.angle + delta;
        drag.current = {
            pointerAngle,
            angle:
                max - min >= 360 ? angle : Math.min(max, Math.max(min, angle)),
        };
        setDragAngle(drag.current.angle);
        const nextValue = snapRotation(drag.current.angle, min, max, step);
        if (nextValue !== value) {
            onChange?.(nextValue);
        }
    };
    const stop = () => {
        drag.current = undefined;
        setDragAngle(undefined);
    };

    return {
        start,
        move,
        stop,
        disabled: inactive,
        dragging: !inactive && dragAngle !== undefined,
        displayAngle: !inactive && dragAngle !== undefined ? dragAngle : value,
    };
};
