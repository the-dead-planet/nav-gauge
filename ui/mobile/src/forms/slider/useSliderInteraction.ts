import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder } from "react-native";
import { SliderProps, snapSliderValue, ThemeAppearanceState } from "@ui";

export const useSliderInteraction = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    highlighted,
    onChange,
}: SliderProps) => {
    const [width, setWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const context = useRef({
        value,
        min,
        max,
        step,
        disabled,
        onChange,
        width,
    });
    context.current = { value, min, max, step, disabled, onChange, width };
    const startPosition = useRef(0);
    const startPageX = useRef(0);

    useEffect(() => {
        if (disabled) {
            setDragging(false);
            setFocused(false);
            setHovered(false);
        }
    }, [disabled]);

    const [panResponder] = useState(() => {
        const updateValue = (position: number) => {
            const current = context.current;
            if (current.disabled || current.width <= 0) {
                return;
            }
            const ratio = Math.max(0, Math.min(1, position / current.width));
            const nextValue = snapSliderValue(
                current.min + ratio * (current.max - current.min),
                current.min,
                current.max,
                current.step,
            );
            if (nextValue !== current.value) {
                current.onChange?.(nextValue);
            }
        };
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !context.current.disabled,
            onMoveShouldSetPanResponder: () => !context.current.disabled,
            onPanResponderGrant: (event) => {
                if (context.current.disabled) {
                    return;
                }
                setDragging(true);
                startPosition.current = event.nativeEvent.locationX;
                startPageX.current = event.nativeEvent.pageX;
                updateValue(startPosition.current);
            },
            onPanResponderMove: (event) => {
                updateValue(
                    startPosition.current +
                        event.nativeEvent.pageX -
                        startPageX.current,
                );
            },
            onPanResponderRelease: () => setDragging(false),
            onPanResponderTerminate: () => setDragging(false),
        });
    });

    const adjustValue = (direction: number) => {
        if (!disabled) {
            onChange?.(
                snapSliderValue(value + direction * step, min, max, step),
            );
        }
    };
    const state: ThemeAppearanceState = disabled
        ? "disabled"
        : highlighted || dragging
          ? "active-pressed"
          : focused || hovered
            ? "hover-focus"
            : "default";

    return {
        state,
        focused: focused && !disabled,
        width,
        interaction: {
            ...panResponder.panHandlers,
            onLayout: (event: LayoutChangeEvent) =>
                setWidth(event.nativeEvent.layout.width),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            onPointerEnter: () => setHovered(true),
            onPointerLeave: () => setHovered(false),
        },
        adjustValue,
    };
};
