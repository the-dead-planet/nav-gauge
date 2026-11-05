import { useLayoutEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent } from "react-native";
import { useReducedMotion } from "../../motion/useReducedMotion";

export const useFieldsetTransition = (expanded: boolean) => {
    const reducedMotion = useReducedMotion();
    const [contentHeight, setContentHeight] = useState<number>();
    const [height] = useState(() => new Animated.Value(0));
    const initialized = useRef(false);
    const targetHeight = expanded ? contentHeight : 0;

    useLayoutEffect(() => {
        if (targetHeight === undefined) {
            return;
        }
        if (!initialized.current || reducedMotion) {
            initialized.current = true;
            height.setValue(targetHeight);
            return;
        }
        const animation = Animated.timing(height, {
            toValue: targetHeight,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        });
        animation.start();
        return () => animation.stop();
    }, [targetHeight, reducedMotion, height]);

    const onLayout = (event: LayoutChangeEvent) => {
        setContentHeight(event.nativeEvent.layout.height);
    };

    return { height, onLayout };
};
