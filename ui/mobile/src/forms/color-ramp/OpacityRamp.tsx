import { colorRampThumbSizes, OpacityRampProps, sliderRampHeights } from "@ui";
import { FC } from "react";
import {
    AccessibilityActionEvent,
    StyleSheet,
    View,
} from "react-native";
import Svg, {
    Defs,
    LinearGradient,
    Pattern,
    Rect,
    Stop,
} from "react-native-svg";
import { DisabledRampPattern } from "./DisabledRampPattern";
import { useRampResponder } from "./useRampResponder";
import { clampZeroOne } from "@tinker-chest";

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

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    value,
    label = "Opacity",
    size = "sm",
    disabled = false,
    onChange,
}) => {
    const height = sliderRampHeights[size];
    const thumbSize = colorRampThumbSizes[size];
    const { width, onLayout, panHandlers } = useRampResponder(
        disabled,
        (horizontalPosition) => onChange(horizontalPosition),
    );
    const handleAccessibility = (event: AccessibilityActionEvent) => {
        if (disabled) {
            return;
        }
        const change =
            event.nativeEvent.actionName === "increment" ? 0.05 : -0.05;
        onChange(clampZeroOne(value + change));
    };

    return (
        <View
            style={[styles.ramp, { height }]}
            hitSlop={8}
            onLayout={onLayout}
            accessibilityRole="adjustable"
            accessibilityLabel={label}
            accessibilityValue={{
                min: 0,
                max: 1,
                now: value,
                text: `${Math.round(value * 100)}%`,
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
                    <Pattern
                        id="checkerboard"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                    >
                        <Rect width="8" height="8" fill="#fff" />
                        <Rect width="4" height="4" fill="#bbb" />
                        <Rect x="4" y="4" width="4" height="4" fill="#bbb" />
                    </Pattern>
                    <LinearGradient id="opacity" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={color} stopOpacity="0" />
                        <Stop offset="1" stopColor={color} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#checkerboard)" />
                <Rect width="100%" height="100%" fill="url(#opacity)" />
            </Svg>
            <View
                style={[
                    styles.thumb,
                    {
                        top: -2,
                        width: thumbSize,
                        height: thumbSize,
                        marginLeft: -thumbSize / 2,
                        left: clampZeroOne(value) * width,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
