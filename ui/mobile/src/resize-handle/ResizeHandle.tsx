import { FC, useCallback, useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, StyleSheet, View } from "react-native";
import { ResizeHandleProps, useTheme } from "@ui";
import { ResizeHandleGrip } from "./ResizeHandleGrip";

const styles = StyleSheet.create({
    horizontalHandle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    verticalHandle: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    horizontalBorder: {
        width: 2,
        height: '100%',
    },
    verticalBorder: {
        height: 2,
        width: '100%',
    },
    grip: {
        position: 'absolute',
    },
    horizontalGrip: {
        left: 6,
        transform: [{ translateY: -12 }],
    },
    verticalGrip: {
        top: 6,
        transform: [{ translateX: -12 }],
    },
});

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    side,
    color = 'neutral',
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
}) => {
    const theme = useTheme();
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
    const propsRef = useRef({ direction, disabled, onDrag, onDragStart, onDragEnd });
    propsRef.current = { direction, disabled, onDrag, onDragStart, onDragEnd };
    const [isDragging, setIsDragging] = useState(false);
    const [handleLength, setHandleLength] = useState(0);

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setHandleLength(direction === 'horizontal' ? height : width);
    }, [direction]);

    const handleMove = useCallback((event: GestureResponderEvent) => {
        const lastPosition = lastPositionRef.current;
        if (!lastPosition) {
            return;
        }
        const { pageX, pageY } = event.nativeEvent;
        const delta = propsRef.current.direction === 'horizontal' ? pageX - lastPosition.x : pageY - lastPosition.y;
        lastPositionRef.current = { x: pageX, y: pageY };
        if (delta !== 0) {
            propsRef.current.onDrag(delta);
        }
    }, []);

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => !propsRef.current.disabled,
        onMoveShouldSetPanResponder: () => !propsRef.current.disabled,
        onPanResponderGrant: (evt) => {
            lastPositionRef.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
            propsRef.current.onDragStart?.(propsRef.current.direction === 'horizontal' ? evt.nativeEvent.pageX : evt.nativeEvent.pageY);
            setIsDragging(true);
        },
        onPanResponderMove: handleMove,
        onPanResponderRelease: () => {
            lastPositionRef.current = null;
            propsRef.current.onDragEnd?.();
            setIsDragging(false);
        },
        onPanResponderTerminate: () => {
            lastPositionRef.current = null;
            propsRef.current.onDragEnd?.();
            setIsDragging(false);
        },
    })).current;

    const handleColor = theme.color(color, 500, color === 'neutral' ? 0.4 : 1);
    const isHorizontal = direction === 'horizontal';

    return (
        <View
            {...panResponder.panHandlers}
            onLayout={handleLayout}
            style={isHorizontal ? styles.horizontalHandle : styles.verticalHandle}
        >
            <View
                style={[
                    isHorizontal ? styles.horizontalBorder : styles.verticalBorder,
                    { backgroundColor: handleColor },
                    isDragging && { backgroundColor: theme.color('secondary') },
                ]}
            />
            {(handleLength >= 500 ? [25, 75] : [50]).map((position) => (
                <ResizeHandleGrip
                    key={position}
                    isDragging={isDragging}
                    position={position}
                    color={color}
                    direction={direction}
                    side={side}
                />
            ))}
        </View>
    );
};
