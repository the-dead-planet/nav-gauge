import { colorRampThumbSizes, SaturationValueRampProps } from "@ui";
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
        overflow: "hidden",
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

const heights = { xs: 100, sm: 140, md: 180 } as const;
const clamp = (value: number): number => Math.max(0, Math.min(1, value));

export const SaturationValueRamp: FC<SaturationValueRampProps> = ({
    hue,
    saturation,
    brightness,
    label = "Color",
    size = "sm",
    disabled = false,
    onChange,
}) => {
    const height = heights[size];
    const thumbSize = colorRampThumbSizes[size];
    const { width, onLayout, panHandlers } = useRampResponder(
        disabled,
        (horizontalPosition, verticalPosition) => {
            onChange(horizontalPosition, clamp(1 - verticalPosition / height));
        },
    );
    const handleAccessibility = (event: AccessibilityActionEvent) => {
        if (disabled) {
            return;
        }
        const change =
            event.nativeEvent.actionName === "increment" ? 0.05 : -0.05;
        onChange(clamp(saturation + change), brightness);
    };

    return (
        <View
            style={[styles.ramp, { height }]}
            onLayout={onLayout}
            accessibilityRole="adjustable"
            accessibilityLabel={`${label} saturation and brightness`}
            accessibilityValue={{
                text: `${Math.round(saturation * 100)}% saturation, ${Math.round(brightness * 100)}% brightness`,
            }}
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
                    <LinearGradient id="white" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#fff" stopOpacity="1" />
                        <Stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </LinearGradient>
                    <LinearGradient id="black" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#000" stopOpacity="0" />
                        <Stop offset="1" stopColor="#000" stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect
                    width="100%"
                    height="100%"
                    fill={`hsl(${hue}, 100%, 50%)`}
                />
                <Rect width="100%" height="100%" fill="url(#white)" />
                <Rect width="100%" height="100%" fill="url(#black)" />
            </Svg>
            <View
                style={[
                    styles.thumb,
                    {
                        width: thumbSize,
                        height: thumbSize,
                        marginLeft: -thumbSize / 2,
                        marginTop: -thumbSize / 2,
                        borderRadius: 0,
                        left: saturation * width,
                        top: (1 - brightness) * height,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
