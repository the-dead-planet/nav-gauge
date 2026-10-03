import { colorRampThumbSizes, HueRampProps, SizeVariant, sliderRampHeights } from "@ui";
import { FC } from "react";
import {
    AccessibilityActionEvent,
    StyleSheet,
    View,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { DisabledRampPattern } from "./DisabledRampPattern";
import { useRampResponder } from "./useRampResponder";

const styles = StyleSheet.create({
    ramp: {
        position: "relative",
        width: "100%",
        overflow: "visible",
        borderWidth: 1,
        borderRadius: 0,
    },
    thumb: {
        position: "absolute",
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "transparent",
        boxShadow: "0 0 0 1px #000",
        transform: [{ rotate: "45deg" }],
        pointerEvents: "none",
    },
});

export const HueRamp: FC<HueRampProps> = ({
    value,
    label = "Color",
    size = "sm",
    disabled = false,
    onChange,
}) => {
    const height = sliderRampHeights[size];
    const thumbSize = colorRampThumbSizes[size];
    const { width, onLayout, panHandlers } = useRampResponder(
        disabled,
        (horizontalPosition) => onChange(horizontalPosition * 360),
    );
    const handleAccessibility = (event: AccessibilityActionEvent) => {
        if (disabled) {
            return;
        }
        const change = event.nativeEvent.actionName === "increment" ? 5 : -5;
        onChange(Math.max(0, Math.min(360, value + change)));
    };

    return (
        <View
            style={[styles.ramp, { height }]}
            hitSlop={8}
            onLayout={onLayout}
            accessibilityRole="adjustable"
            accessibilityLabel={`${label} hue`}
            accessibilityValue={{ min: 0, max: 360, now: Math.round(value) }}
            accessibilityState={{ disabled }}
            accessibilityActions={[
                { name: "increment" },
                { name: "decrement" },
            ]}
            onAccessibilityAction={handleAccessibility}
            {...panHandlers}
        >
            <Svg width="100%" height="100%">
                <Defs>
                    <LinearGradient id="hue" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#f00" />
                        <Stop offset="0.167" stopColor="#ff0" />
                        <Stop offset="0.333" stopColor="#0f0" />
                        <Stop offset="0.5" stopColor="#0ff" />
                        <Stop offset="0.667" stopColor="#00f" />
                        <Stop offset="0.833" stopColor="#f0f" />
                        <Stop offset="1" stopColor="#f00" />
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#hue)" />
            </Svg>
            <View
                style={[
                    styles.thumb,
                    {
                        top: -2,
                        width: thumbSize,
                        height: thumbSize,
                        marginLeft: -thumbSize / 2,
                        left: (value / 360) * width,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
