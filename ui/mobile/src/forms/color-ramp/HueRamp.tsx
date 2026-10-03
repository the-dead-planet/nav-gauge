import { HueRampProps } from "@ui";
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

const heights = { xs: 12, sm: 16, md: 20 } as const;
const clamp = (value: number): number => Math.max(0, Math.min(1, value));

export const HueRamp: FC<HueRampProps> = ({
    value,
    label = "Color",
    size = "sm",
    disabled = false,
    onChange,
}) => {
    const rampReference = useRef<HostInstance>(null);
    const height = heights[size];
    const thumbSize = height + 4;
    const [layout, setLayout] = useState({ x: 0, width: 0 });
    const contextReference = useRef({ disabled, onChange, layout });
    contextReference.current = { disabled, onChange, layout };

    const update = (pageX: number) => {
        const context = contextReference.current;
        if (context.disabled || context.layout.width === 0) {
            return;
        }
        context.onChange(
            clamp((pageX - context.layout.x) / context.layout.width) * 360,
        );
    };
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onMoveShouldSetPanResponder: () =>
                    !contextReference.current.disabled,
                onPanResponderGrant: (event) => update(event.nativeEvent.pageX),
                onPanResponderMove: (event) => update(event.nativeEvent.pageX),
            }),
        [],
    );
    const handleLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        rampReference.current?.measureInWindow((x) => setLayout({ x, width }));
    };
    const handleAccessibility = (event: AccessibilityActionEvent) => {
        if (disabled) {
            return;
        }
        const change = event.nativeEvent.actionName === "increment" ? 5 : -5;
        onChange(Math.max(0, Math.min(360, value + change)));
    };

    return (
        <View
            ref={rampReference}
            style={[styles.ramp, { height }]}
            onLayout={handleLayout}
            accessibilityRole="adjustable"
            accessibilityLabel={`${label} hue`}
            accessibilityValue={{ min: 0, max: 360, now: Math.round(value) }}
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
                        left: (value / 360) * layout.width,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
