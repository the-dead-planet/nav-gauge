import { KeyboardEvent, PointerEvent, useRef } from "react";
import { clampZeroOne } from "@tinker-chest";
import { SaturationValueRampProps } from "@ui";

export const useSaturationValueRampInteraction = ({
    saturation,
    brightness,
    disabled,
    onChange,
}: SaturationValueRampProps) => {
    const boundsReference = useRef<DOMRect | null>(null);
    const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
        const bounds = boundsReference.current;
        if (disabled || !bounds || bounds.width <= 0 || bounds.height <= 0) {
            return;
        }
        onChange(
            clampZeroOne((event.clientX - bounds.left) / bounds.width),
            clampZeroOne(1 - (event.clientY - bounds.top) / bounds.height),
        );
    };

    return {
        onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
            if (disabled) {
                return;
            }
            event.currentTarget.focus();
            boundsReference.current =
                event.currentTarget.getBoundingClientRect();
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event);
        },
        onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                updateFromPointer(event);
            }
        },
        onLostPointerCapture: () => {
            boundsReference.current = null;
        },
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
            if (disabled) {
                return;
            }
            const step = event.shiftKey ? 0.1 : 0.01;
            switch (event.key) {
                case "ArrowLeft":
                    onChange(clampZeroOne(saturation - step), brightness);
                    break;
                case "ArrowRight":
                    onChange(clampZeroOne(saturation + step), brightness);
                    break;
                case "ArrowDown":
                    onChange(saturation, clampZeroOne(brightness - step));
                    break;
                case "ArrowUp":
                    onChange(saturation, clampZeroOne(brightness + step));
                    break;
                default:
                    return;
            }
            event.preventDefault();
        },
    };
};
