import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import { ActiveGlow, ColorVariant, useTheme } from "@ui";
import { useReducedMotion } from "./useReducedMotion";

export const useActiveGlow = (
    activeGlow: ActiveGlow,
    active: boolean,
    color: ColorVariant,
) => {
    const theme = useTheme();
    const reducedMotion = useReducedMotion();
    const [progress] = useState(() => new Animated.Value(0));

    useEffect(() => {
        progress.setValue(0);
        if (!active || activeGlow !== "animate-borders-glow" || reducedMotion) {
            return;
        }
        const animation = Animated.timing(progress, {
            toValue: 1,
            duration: 400,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: false,
        });
        animation.start();
        return () => animation.stop();
    }, [active, activeGlow, reducedMotion, progress]);

    if (!active || activeGlow === "none") {
        return undefined;
    }
    if (activeGlow === "glow" || reducedMotion) {
        return `0px 0px 4px ${theme.color(color, 500, 0.3)}, 0px 0px 20px ${theme.color(color, 500, 0.6)}`;
    }

    const glowColor = theme.color(color, 500, 0.6);
    const transparentColor = theme.color(color, 500, 0);
    const offsets: [number, number][] = [
        [-1, 1],
        [-1, -1],
        [1, -1],
        [1, 1],
    ];
    return progress.interpolate({
        inputRange: [0, 0.33, 0.66, 1],
        outputRange: [1, 2, 3, 4].map((edgeCount) =>
            offsets
                .map(
                    ([horizontal, vertical], index) =>
                        `${horizontal}px ${vertical}px 4px ${index < edgeCount ? glowColor : transparentColor}`,
                )
                .join(", "),
        ),
    });
};
