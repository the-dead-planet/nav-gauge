import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent } from "react-native";
import { useReducedMotion } from "../../motion/useReducedMotion";

export const useFieldsetHeight = (expanded: boolean) => {
    const [contentHeight, setContentHeight] = useState<number>();
    const [animatedHeight] = useState(() => new Animated.Value(0));
    const measured = useRef(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (contentHeight === undefined) {
            return;
        }
        const targetHeight = expanded ? contentHeight : 0;
        if (!measured.current || reducedMotion) {
            measured.current = true;
            animatedHeight.setValue(targetHeight);
            return;
        }
        const animation = Animated.timing(animatedHeight, {
            toValue: targetHeight,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        });
        animation.start();
        return () => animation.stop();
    }, [expanded, contentHeight, reducedMotion, animatedHeight]);

    const onLayout = (event: LayoutChangeEvent) => {
        setContentHeight(event.nativeEvent.layout.height);
    };

    return {
        height:
            expanded && contentHeight === undefined
                ? undefined
                : animatedHeight,
        onLayout,
    };
};
