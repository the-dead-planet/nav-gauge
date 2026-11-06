import {
    colorRampThumbSizes,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    saturationValueRampHeights,
    SaturationValueRampProps,
    useTheme,
} from "@ui";
import { FC } from "react";
import { AccessibilityActionEvent, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { DisabledRampPattern } from "./DisabledRampPattern";
import { useRampResponder } from "./useRampResponder";
import { clampZeroOne } from "@tinker-chest";

const styles = StyleSheet.create({
    ramp: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 0,
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

export const SaturationValueRamp: FC<SaturationValueRampProps> = ({
    hue,
    saturation,
    brightness,
    label = "Color",
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => {
    const height = saturationValueRampHeights[size];
    const thumbSize = colorRampThumbSizes[size];
    const theme = useTheme();
    const { width, onLayout, panHandlers, state, focused } = useRampResponder(
        disabled,
        (horizontalPosition, verticalPosition) => {
            onChange(
                horizontalPosition,
                clampZeroOne(1 - verticalPosition / height),
            );
        },
    );
    const appearance = theme.resolveAppearance(
        "default",
        DEFAULT_COLOR,
        DEFAULT_COLOR,
        state,
    );
    const handleAccessibility = (event: AccessibilityActionEvent) => {
        if (disabled) {
            return;
        }
        const change =
            event.nativeEvent.actionName === "increment" ? 0.05 : -0.05;
        onChange(clampZeroOne(saturation + change), brightness);
    };

    return (
        <View
            style={[
                styles.ramp,
                {
                    height,
                    borderColor: appearance.border.color,
                    borderWidth: appearance.border.width,
                    outlineStyle: "solid",
                    outlineWidth: focused ? 2 : 0,
                    outlineOffset: 3,
                    outlineColor: appearance.effects.glowColor,
                },
            ]}
            focusable={!disabled}
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
