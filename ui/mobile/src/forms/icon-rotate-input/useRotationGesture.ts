import { useMemo, useRef } from "react";
import { PanResponder, type ViewInstance } from "react-native";
import {
    IconRotateInputProps,
    svgAtan2ToClockAngle,
    useRotationInput,
} from "@ui";

export const useRotationGesture = (props: IconRotateInputProps) => {
    const rotation = useRotationInput(props);
    const target = useRef<ViewInstance>(null);
    const center = useRef({ x: 0, y: 0 });
    const current = useRef(rotation);
    current.current = rotation;
    const panResponder = useMemo(() => {
        const pointerAngle = (pageX: number, pageY: number) =>
            svgAtan2ToClockAngle(
                pageX - center.current.x,
                pageY - center.current.y,
            );
        let measuring = false;
        let active = false;
        const stop = () => {
            active = false;
            current.current.stop();
        };
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !current.current.disabled,
            onMoveShouldSetPanResponder: () => !current.current.disabled,
            onPanResponderGrant: (event) => {
                if (current.current.disabled) {
                    return;
                }
                active = true;
                measuring = true;
                const { pageX, pageY } = event.nativeEvent;
                target.current?.measure((_x, _y, width, height, left, top) => {
                    measuring = false;
                    if (!active) {
                        return;
                    }
                    center.current = {
                        x: left + width / 2,
                        y: top + height / 2,
                    };
                    current.current.start(pointerAngle(pageX, pageY));
                });
            },
            onPanResponderMove: (event) => {
                if (!measuring) {
                    current.current.move(
                        pointerAngle(
                            event.nativeEvent.pageX,
                            event.nativeEvent.pageY,
                        ),
                    );
                }
            },
            onPanResponderRelease: stop,
            onPanResponderTerminate: stop,
        });
    }, []);

    return { ...rotation, target, panHandlers: panResponder.panHandlers };
};
