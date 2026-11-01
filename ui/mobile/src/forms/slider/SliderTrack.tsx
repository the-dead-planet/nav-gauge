import { FC } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getSliderRatio,
    SliderProps,
    useTheme,
} from "@ui";
import { useSliderInteraction } from "./useSliderInteraction";
import { useActiveGlow } from "../../motion/useActiveGlow";

const styles = StyleSheet.create({
    slider: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },
    hitArea: {
        justifyContent: "center",
    },
    track: {
        position: "relative",
    },
    trackCap: {
        position: "absolute",
        transform: [{ rotate: "45deg" }],
    },
    progress: {
        height: "100%",
    },
    thumb: {
        position: "absolute",
        transform: [{ rotate: "45deg" }],
    },
});

type Props = Pick<
    SliderProps,
    | "value"
    | "onChange"
    | "min"
    | "max"
    | "step"
    | "color"
    | "highlightColor"
    | "size"
    | "variant"
    | "activeGlow"
    | "highlighted"
    | "disabled"
    | "ariaLabel"
>;

export const SliderTrack: FC<Props> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    color = DEFAULT_COLOR,
    highlightColor = color,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    highlighted = false,
    disabled = false,
    ariaLabel = "Slider",
}) => {
    const theme = useTheme();
    const { state, focused, width, interaction, adjustValue } =
        useSliderInteraction({
            value,
            min,
            max,
            step,
            disabled,
            highlighted,
            onChange,
        });
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
    );
    const controlSize = theme.sizes.control[size];
    const filledTrackColor =
        state === "hover-focus" || state === "active-pressed"
            ? variant === "fill"
                ? appearance.surface
                : appearance.border.color
            : theme.color(color, 500);
    const boxShadow = useActiveGlow(
        activeGlow,
        state === "hover-focus" || state === "active-pressed",
        highlightColor,
    );
    const { thumbSize, trackThickness } = controlSize;
    const unfilledTrackColor = theme.color(
        color,
        theme.mode === "light" ? 300 : 700,
    );
    const trackCapSize = trackThickness / Math.SQRT2;
    const trackCapGeometry: ViewStyle = {
        width: trackCapSize,
        height: trackCapSize,
        top: (trackThickness - trackCapSize) / 2,
    };
    const fillWidth = width * getSliderRatio(value, min, max);

    return (
        <View style={[styles.slider, { height: controlSize.height }]}>
            <View
                {...interaction}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel={ariaLabel}
                accessibilityState={{ disabled }}
                accessibilityValue={{ min, max, now: value }}
                accessibilityActions={[
                    { name: "increment" },
                    { name: "decrement" },
                ]}
                onAccessibilityAction={(event) => {
                    if (event.nativeEvent.actionName === "increment") {
                        adjustValue(1);
                    } else if (event.nativeEvent.actionName === "decrement") {
                        adjustValue(-1);
                    }
                }}
                focusable={!disabled}
                style={[
                    styles.hitArea,
                    {
                        height: controlSize.height,
                        marginHorizontal: thumbSize / 2,
                        outlineStyle: "solid",
                        outlineWidth: focused ? 2 : 0,
                        outlineOffset: 2,
                        outlineColor: appearance.effects.glowColor,
                    },
                ]}
            >
                <View
                    pointerEvents="none"
                    style={[
                        styles.track,
                        {
                            height: trackThickness,
                            backgroundColor: unfilledTrackColor,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.trackCap,
                            trackCapGeometry,
                            {
                                left: -trackCapSize / 2,
                                backgroundColor: filledTrackColor,
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.trackCap,
                            trackCapGeometry,
                            {
                                right: -trackCapSize / 2,
                                backgroundColor: unfilledTrackColor,
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.progress,
                            {
                                width: fillWidth,
                                backgroundColor: filledTrackColor,
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.thumb,
                            {
                                left: fillWidth - thumbSize / 2,
                                top: (trackThickness - thumbSize) / 2,
                                width: thumbSize,
                                height: thumbSize,
                                backgroundColor: appearance.surface,
                                borderColor: appearance.border.color,
                                borderWidth: appearance.border.width * 2,
                                boxShadow,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};
