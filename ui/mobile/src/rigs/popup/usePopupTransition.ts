import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { MenuAnchor } from '@ui';

export const usePopupTransition = (
    visible: boolean,
    popupAnchor: MenuAnchor,
) => {
    const progress = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const animation = Animated.timing(progress, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        });
        animation.start();
        return () => animation.stop();
    }, [visible, progress]);

    return {
        opacity: progress,
        transform: [
            {
                translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: popupAnchor.startsWith('top')
                        ? [-100, 0]
                        : [100, 0],
                }),
            },
        ],
    };
};
