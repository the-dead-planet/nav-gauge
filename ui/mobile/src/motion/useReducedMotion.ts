import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

// Avoid starting motion before the system preference is available.
const INITIAL_REDUCED_MOTION = true;

export const useReducedMotion = (): boolean => {
    const [reducedMotion, setReducedMotion] = useState(INITIAL_REDUCED_MOTION);

    useEffect(() => {
        let mounted = true;
        const updatePreference = (enabled: boolean) => {
            if (mounted) {
                setReducedMotion(enabled);
            }
        };
        const subscription = AccessibilityInfo.addEventListener(
            "reduceMotionChanged",
            updatePreference,
        );
        AccessibilityInfo.isReduceMotionEnabled().then(updatePreference, () =>
            updatePreference(true),
        );

        return () => {
            mounted = false;
            subscription.remove();
        };
    }, []);

    return reducedMotion;
};
