import { SaturationValueRampProps } from "@ui";
import { FC, useMemo, useRef, useState } from "react";
import {
    AccessibilityActionEvent,
    HostInstance,
    LayoutChangeEvent,
    PanResponder,
    StyleSheet,
    View,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { DisabledRampPattern } from "./DisabledRampPattern";

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
const thumbSizes = { xs: 12, sm: 14, md: 16 } as const;
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
    const rampReference = useRef<HostInstance>(null);
    const height = heights[size];
    const thumbSize = thumbSizes[size];
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0 });
    const contextReference = useRef({ disabled, onChange, layout, height });
    contextReference.current = { disabled, onChange, layout, height };

    const update = (pageX: number, pageY: number) => {
        const context = contextReference.current;
        if (context.disabled || context.layout.width === 0) {
            return;
        }
        context.onChange(
            clamp((pageX - context.layout.x) / context.layout.width),
            clamp(1 - (pageY - context.layout.y) / context.height),
        );
    };
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onMoveShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onPanResponderGrant: (event) =>
                    update(event.nativeEvent.pageX, event.nativeEvent.pageY),
                onPanResponderMove: (event) =>
                    update(event.nativeEvent.pageX, event.nativeEvent.pageY),
            }),
        [],
    );
    const handleLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        rampReference.current?.measureInWindow((x, y) =>
            setLayout({ x, y, width }),
        );
    };
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
            ref={rampReference}
            style={[styles.ramp, { height }]}
            onLayout={handleLayout}
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
            {...panResponder.panHandlers}
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
                        left: saturation * layout.width,
                        top: (1 - brightness) * height,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
