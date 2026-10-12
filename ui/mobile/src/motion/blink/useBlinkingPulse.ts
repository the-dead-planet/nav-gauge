import { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * Runs the 1.6s blink pulse to use directly in `opacity` or `interpolate` for non-transparency properties (for example `borderColor`).
 * @returns an `Animated.Value` in `[0, 1]`
 */
export const useBlinkingPulse = (): Animated.Value => {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 0, useNativeDriver: false }),
                Animated.delay(720),
                Animated.timing(pulse, { toValue: 0, duration: 160, useNativeDriver: false }),
                Animated.delay(720),
            ])
        );
        blinkAnimation.start();

        return () => blinkAnimation.stop();
    }, [pulse]);

    return pulse;
};
