import { OpacityRampProps } from "@ui";
import { FC, useMemo, useRef, useState } from "react";
import {
    AccessibilityActionEvent,
    HostInstance,
    LayoutChangeEvent,
    PanResponder,
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

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    value,
    label = "Opacity",
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
            clamp((pageX - context.layout.x) / context.layout.width),
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
        const change =
            event.nativeEvent.actionName === "increment" ? 0.05 : -0.05;
        onChange(clamp(value + change));
    };

    return (
        <View
            ref={rampReference}
            style={[styles.ramp, { height }]}
            onLayout={handleLayout}
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
            {...panResponder.panHandlers}
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
                        left: clamp(value) * layout.width,
                    },
                ]}
            />
            {disabled ? <DisabledRampPattern /> : null}
        </View>
    );
};
