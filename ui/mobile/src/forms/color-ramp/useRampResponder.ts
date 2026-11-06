import { useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder } from "react-native";
import { clampZeroOne } from "@tinker-chest";
import { useHudInteraction } from "../../hud/useHudInteraction";

export const useRampResponder = (
    disabled: boolean,
    onPositionChange: (
        horizontalPosition: number,
        verticalPosition: number,
    ) => void,
) => {
    const [width, setWidth] = useState(0);
    const { state, focused, interaction, pointerInteraction } =
        useHudInteraction({ disabled });
    const contextReference = useRef({
        disabled,
        onPositionChange,
        width,
        interaction,
    });
    contextReference.current = {
        disabled,
        onPositionChange,
        width,
        interaction,
    };

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onMoveShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onPanResponderGrant: (event) => {
                    const context = contextReference.current;
                    context.interaction.onPressIn?.(event);
                    if (!context.disabled && context.width > 0) {
                        context.onPositionChange(
                            clampZeroOne(
                                event.nativeEvent.locationX / context.width,
                            ),
                            event.nativeEvent.locationY,
                        );
                    }
                },
                onPanResponderMove: (event) => {
                    const context = contextReference.current;
                    if (!context.disabled && context.width > 0) {
                        context.onPositionChange(
                            clampZeroOne(
                                event.nativeEvent.locationX / context.width,
                            ),
                            event.nativeEvent.locationY,
                        );
                    }
                },
                onPanResponderRelease: (event) => {
                    contextReference.current.interaction.onPressOut?.(event);
                },
                onPanResponderTerminate: (event) => {
                    contextReference.current.interaction.onPressOut?.(event);
                },
            }),
        [],
    );
    const onLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    };

    return {
        width,
        onLayout,
        state,
        focused,
        panHandlers: {
            ...panResponder.panHandlers,
            onFocus: interaction.onFocus,
            onBlur: interaction.onBlur,
            ...pointerInteraction,
        },
    };
};
