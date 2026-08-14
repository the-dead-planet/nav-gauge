import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const TRANSITION_DURATION_MS = 250;

interface AnimationOptions {
    animate?: boolean;
    duration?: number;
}

export const useAnimatedSize = (
    size: number,
    {
        animate = true,
        duration = TRANSITION_DURATION_MS }: AnimationOptions = {}
) => {
    const animatedSize = useRef(new Animated.Value(size)).current;

    useEffect(() => {
        if (!animate) {
            animatedSize.setValue(size);
            return;
        }

        Animated.timing(animatedSize, {
            toValue: size,
            duration,
            useNativeDriver: false,
        }).start();
    }, [animate, animatedSize, size]);

    return animatedSize;
};
