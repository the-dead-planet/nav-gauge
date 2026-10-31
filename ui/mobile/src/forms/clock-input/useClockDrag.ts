import { useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, type ViewInstance } from "react-native";
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
    viewBox: { x: number; y: number; width: number; height: number };
    disabled: boolean;
    onChange?: (value: number) => void;
}

export const useClockDrag = (options: Options) => {
    const viewRef = useRef<ViewInstance>(null);
    const handRef = useRef<ClockHand | null>(null);
    const active = useRef(false);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (options.disabled) {
            handRef.current = null;
            active.current = false;
            setDragging(false);
        }
    }, [options.disabled]);
    const update = (pageX: number, pageY: number, starting: boolean) => {
        if (options.disabled || (!starting && handRef.current === null)) {
            return;
        }
        viewRef.current?.measure((_x, _y, width, height, left, top) => {
            if (
                !active.current ||
                latest.current.disabled ||
                (!starting && handRef.current === null)
            ) {
                return;
            }
            const {
                mode,
                value,
                min,
                max,
                step,
                center,
                outerRadius,
                viewBox,
                onChange,
            } = latest.current;
            const scale = Math.min(
                width / viewBox.width,
                height / viewBox.height,
            );
            const horizontal =
                viewBox.x +
                (pageX - left - (width - viewBox.width * scale) / 2) / scale -
                center;
            const vertical =
                viewBox.y +
                (pageY - top - (height - viewBox.height * scale) / 2) / scale -
                center;
            const distance = Math.hypot(horizontal, vertical);
            if (starting) {
                handRef.current =
                    mode !== "duration"
                        ? "angle"
                        : Math.abs(distance - outerRadius) <=
                            Math.abs(
                                distance - outerRadius * MINUTES_HAND_FRACTION,
                            )
                          ? "seconds"
                          : "minutes";
                setDragging(true);
            }
            if (distance < 4 || handRef.current === null) {
                return;
            }
            const next = clockValueFromAngle(
                value,
                svgAtan2ToClockAngle(horizontal, vertical),
                handRef.current,
                min,
                max,
                step,
            );
            if (next !== value) {
                onChange?.(next);
            }
        });
    };
    const latest = useRef({ ...options, update });
    latest.current = { ...options, update };

    // A gesture keeps the same responder while controlled values rerender it.
    const responder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => !latest.current.disabled,
                onMoveShouldSetPanResponder: () => !latest.current.disabled,
                onPanResponderGrant: (event) => {
                    active.current = true;
                    latest.current.update(
                        event.nativeEvent.pageX,
                        event.nativeEvent.pageY,
                        true,
                    );
                },
                onPanResponderMove: (event) =>
                    latest.current.update(
                        event.nativeEvent.pageX,
                        event.nativeEvent.pageY,
                        false,
                    ),
                onPanResponderRelease: () => {
                    active.current = false;
                    handRef.current = null;
                    setDragging(false);
                },
                onPanResponderTerminate: () => {
                    active.current = false;
                    handRef.current = null;
                    setDragging(false);
                },
            }),
        [],
    );

    return {
        viewRef,
        dragging: dragging && !options.disabled,
        panHandlers: responder.panHandlers,
    };
};
