import { PointerEvent, useRef } from "react";
import {
    IconRotateInputProps,
    svgAtan2ToClockAngle,
    useRotationInput,
} from "@ui";

export const useRotationPointer = (props: IconRotateInputProps) => {
    const rotation = useRotationInput(props);
    const center = useRef({ x: 0, y: 0 });
    const pointerAngle = (event: PointerEvent<HTMLDivElement>) =>
        svgAtan2ToClockAngle(
            event.clientX - center.current.x,
            event.clientY - center.current.y,
        );

    return {
        ...rotation,
        pointerHandlers: {
            onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
                if (rotation.disabled || event.button !== 0) {
                    return;
                }
                event.preventDefault();
                const bounds = event.currentTarget.getBoundingClientRect();
                center.current = {
                    x: bounds.left + bounds.width / 2,
                    y: bounds.top + bounds.height / 2,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
                rotation.start(pointerAngle(event));
            },
            onPointerMove: (event: PointerEvent<HTMLDivElement>) =>
                rotation.move(pointerAngle(event)),
            onPointerUp: rotation.stop,
            onPointerCancel: rotation.stop,
            onLostPointerCapture: rotation.stop,
        },
    };
};
