import { FC, useEffect, useRef, useState } from "react";
import { Animated, StyleProp, useWindowDimensions, ViewStyle } from "react-native";
import { TransitionProps } from "@ui";

interface Props {
    style?: StyleProp<ViewStyle>;
}

export const Transition: FC<TransitionProps & Props> = ({
    render,
    durationMs = 200,
    slide,
    fade,
    onUnmount,
    style,
    children,
}) => {
    const [unmount, setUnmount] = useState(!render);
    const animValue = useRef(new Animated.Value(1)).current;
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        if (render) {
            setUnmount(false);
            animValue.setValue(1);
            Animated.timing(animValue, {
                toValue: 0,
                duration: durationMs,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 1,
                duration: durationMs,
                useNativeDriver: true,
            }).start(() => {
                setUnmount(true);
                onUnmount?.();
            });
        }
    }, [render]);

    if (unmount) {
        return null;
    }

    const offsets = ((): { x: number; y: number } => {
        switch (slide) {
            case 'to-top': return { x: 0, y: height };
            case 'to-bottom': return { x: 0, y: -height };
            case 'to-left': return { x: width, y: 0 };
            case 'to-right': return { x: -width, y: 0 };
            default: return { x: 0, y: 0 };
        }
    })();

    const interpolatedX = slide
        ? animValue.interpolate({ inputRange: [0, 1], outputRange: [0, offsets.x] })
        : undefined;

    const interpolatedY = slide
        ? animValue.interpolate({ inputRange: [0, 1], outputRange: [0, offsets.y] })
        : undefined;

    const opacity = fade
        ? animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
        : undefined;

    const animatedStyle = {
        ...(interpolatedX !== undefined && {
            transform: [
                ...(interpolatedX !== undefined ? [{ translateX: interpolatedX }] : []),
                ...(interpolatedY !== undefined ? [{ translateY: interpolatedY }] : []),
            ],
        }),
        ...(opacity !== undefined && { opacity }),
    };

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};
