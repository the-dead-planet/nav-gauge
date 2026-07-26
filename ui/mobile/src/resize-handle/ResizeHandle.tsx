import { FC, useCallback, useRef } from "react";
import { GestureResponderEvent, PanResponder, View } from "react-native";
import { ResizeHandleProps, useTheme } from "@ui";

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
}) => {
    const theme = useTheme();
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

    const handleMove = useCallback((_: GestureResponderEvent, gestureState: { dx: number; dy: number }) => {
        if (!lastPositionRef.current) {
            return;
        }
        const delta = direction === 'horizontal' ? gestureState.dx : gestureState.dy;
        if (delta !== 0) {
            onDrag(delta);
        }
    }, [direction, onDrag]);

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => {
            lastPositionRef.current = { x: 0, y: 0 };
            onDragStart?.(evt.nativeEvent.pageX);
        },
        onPanResponderMove: handleMove,
        onPanResponderRelease: () => {
            lastPositionRef.current = null;
            onDragEnd?.();
        },
        onPanResponderTerminate: () => {
            lastPositionRef.current = null;
            onDragEnd?.();
        },
    })).current;

    const borderWidth = 2;
    const hitAreaWidth = 8;

    if (direction === 'horizontal') {
        return (
            <View
                {...panResponder.panHandlers}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: hitAreaWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        width: borderWidth,
                        height: '100%',
                        backgroundColor: disabled ? 'transparent' : theme.color('secondary'),
                        borderRadius: 1,
                        opacity: 0.4,
                    }}
                />
            </View>
        );
    }

    return (
        <View
            {...panResponder.panHandlers}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: hitAreaWidth,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
            }}
        >
            <View
                style={{
                    height: borderWidth,
                    width: '100%',
                    backgroundColor: disabled ? 'transparent' : theme.color('secondary'),
                    borderRadius: 1,
                    opacity: 0.4,
                }}
            />
        </View>
    );
};
