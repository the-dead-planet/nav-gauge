import { useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder } from "react-native";
import { clampZeroOne } from "@tinker-chest";

export const useRampResponder = (
    disabled: boolean,
    onPositionChange: (horizontalPosition: number, verticalPosition: number) => void,
) => {
    const [width, setWidth] = useState(0);
    const contextReference = useRef({ disabled, onPositionChange, width });
    contextReference.current = { disabled, onPositionChange, width };

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onMoveShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onPanResponderGrant: (event) => {
                    const context = contextReference.current;
                    if (context.width > 0) {
                        context.onPositionChange(
                            clampZeroOne(event.nativeEvent.locationX / context.width),
                            event.nativeEvent.locationY,
                        );
                    }
                },
                onPanResponderMove: (event) => {
                    const context = contextReference.current;
                    if (context.width > 0) {
                        context.onPositionChange(
                            clampZeroOne(event.nativeEvent.locationX / context.width),
                            event.nativeEvent.locationY,
                        );
                    }
                },
            }),
        [],
    );
    const onLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    };

    return { width, onLayout, panHandlers: panResponder.panHandlers };
};
