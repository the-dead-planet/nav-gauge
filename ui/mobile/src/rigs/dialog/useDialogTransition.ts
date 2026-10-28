import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useDialogTransition = () => {
    const [render, setRender] = useState(true);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const animation = Animated.timing(overlayOpacity, {
            toValue: render ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        });
        animation.start();
        return () => animation.stop();
    }, [overlayOpacity, render]);
    return { render, close: () => setRender(false), overlayOpacity };
};
