import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import {
    ColorRampSliderProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_VARIANT,
    getSliderRatio,
    snapSliderValue,
    useTheme,
} from "@ui";
import { DisabledRampPattern } from "./DisabledRampPattern";
import { useRampResponder } from "./useRampResponder";

const styles = StyleSheet.create({
    ramp: {
        position: "relative",
        width: "100%",
        borderRadius: 0,
    },
    track: {
        width: "100%",
        borderWidth: 1,
        pointerEvents: "none",
    },
    thumb: {
        position: "absolute",
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "transparent",
        outlineStyle: "solid",
        outlineWidth: 1,
        outlineColor: "#000",
        transform: [{ rotate: "45deg" }],
        pointerEvents: "none",
    },
});

export const ColorRampSlider: FC<
    ColorRampSliderProps & { children: ReactNode; accessibilityStep: number }
> = ({
    value,
    max,
    step,
    accessibilityStep,
    label,
    valueText,
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
    children,
}) => {
    const theme = useTheme();
    const { height: controlHeight, thumbSize } = theme.sizes.control[size];
    const height = controlHeight / 2;
    const { width, onLayout, panHandlers, state, focused } = useRampResponder(
        disabled,
        (position) => onChange(snapSliderValue(position * max, 0, max, step)),
    );
    const appearance = theme.resolveAppearance(
        DEFAULT_VARIANT,
        DEFAULT_COLOR,
        DEFAULT_COLOR,
        disabled ? "disabled" : "default",
    );
    return (
        <View
            {...panHandlers}
            accessible
            onLayout={onLayout}
            focusable={!disabled}
            hitSlop={8}
            accessibilityRole="adjustable"
            accessibilityLabel={label}
            accessibilityValue={{ min: 0, max, now: value, text: valueText }}
            accessibilityState={{ disabled }}
            accessibilityActions={[
                { name: "increment" },
                { name: "decrement" },
            ]}
            onAccessibilityAction={(event) => {
                const action = event.nativeEvent.actionName;
                if (
                    !disabled &&
                    (action === "increment" || action === "decrement")
                ) {
                    onChange(
                        snapSliderValue(
                            value +
                                (action === "increment"
                                    ? accessibilityStep
                                    : -accessibilityStep),
                            0,
                            max,
                            step,
                        ),
                    );
                }
            }}
            style={[
                styles.ramp,
                {
                    height,
                    justifyContent: "center",
                },
            ]}
        >
            <View
                style={[
                    styles.track,
                    {
                        height,
                        borderColor: appearance.border.color,
                    },
                ]}
            >
                {children}
                {disabled ? <DisabledRampPattern /> : null}
            </View>
            <View
                style={[
                    styles.thumb,
                    {
                        top: (height - thumbSize) / 2,
                        width: thumbSize,
                        height: thumbSize,
                        outlineWidth:
                            state === "default" || state === "disabled" ? 1 : 2,
                        outlineColor: focused
                            ? appearance.effects.glowColor
                            : "#000",
                        marginLeft: -thumbSize / 2,
                        left: getSliderRatio(value, 0, max) * width,
                    },
                ]}
            />
        </View>
    );
};
