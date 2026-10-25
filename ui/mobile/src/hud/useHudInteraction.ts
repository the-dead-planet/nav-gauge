import { useEffect, useState } from "react";
import { PressableProps } from "react-native";
import { ThemeAppearanceState } from "@ui";

type InteractionProps = Pick<
    PressableProps,
    | "disabled"
    | "onPressIn"
    | "onPressOut"
    | "onHoverIn"
    | "onHoverOut"
    | "onFocus"
    | "onBlur"
> & { highlighted?: boolean };

export const useHudInteraction = ({
    disabled,
    highlighted,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
}: InteractionProps) => {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (disabled) {
            setPressed(false);
            setHovered(false);
            setFocused(false);
        }
    }, [disabled]);

    const state: ThemeAppearanceState = disabled
        ? "disabled"
        : highlighted || pressed
          ? "active-pressed"
          : hovered || focused
            ? "hover-focus"
            : "default";
    const interaction: Pick<
        PressableProps,
        | "onPressIn"
        | "onPressOut"
        | "onHoverIn"
        | "onHoverOut"
        | "onFocus"
        | "onBlur"
    > = {
        onPressIn: (event) => {
            if (!disabled) {
                setPressed(true);
                onPressIn?.(event);
            }
        },
        onPressOut: (event) => {
            setPressed(false);
            onPressOut?.(event);
        },
        onHoverIn: (event) => {
            setHovered(true);
            onHoverIn?.(event);
        },
        onHoverOut: (event) => {
            setHovered(false);
            onHoverOut?.(event);
        },
        onFocus: (event) => {
            setFocused(true);
            onFocus?.(event);
        },
        onBlur: (event) => {
            setFocused(false);
            onBlur?.(event);
        },
    };
    return { state, interaction };
};
