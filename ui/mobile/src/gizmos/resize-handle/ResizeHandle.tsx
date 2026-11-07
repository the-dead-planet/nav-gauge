import { FC, useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, StyleSheet, View } from "react-native";
import { DEFAULT_COLOR, DEFAULT_FILL_VARIANT, RESIZE_HANDLE_TOUCH_SIZE, ResizeHandleProps, useTheme } from "@ui";
import { ResizeHandleGrip } from "./ResizeHandleGrip";
import { Tooltip } from "../tooltip";
import { useHudInteraction } from '../../hud/useHudInteraction';

const styles = StyleSheet.create({
    horizontalHandle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: RESIZE_HANDLE_TOUCH_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    verticalHandle: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: RESIZE_HANDLE_TOUCH_SIZE,
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
    horizontalEdgeTarget: {
        width: 24,
        height: '100%',
        alignItems: 'center',
    },
    verticalEdgeTarget: {
        height: 24,
        width: '100%',
        justifyContent: 'center',
    },
    gripTarget: {
        position: 'absolute',
        width: RESIZE_HANDLE_TOUCH_SIZE,
        height: RESIZE_HANDLE_TOUCH_SIZE,
        transform: [
            { translateX: -RESIZE_HANDLE_TOUCH_SIZE / 2 },
            { translateY: -RESIZE_HANDLE_TOUCH_SIZE / 2 },
        ],
    },
});

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    side,
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    onDrag,
    onDragStart,
    onDragEnd,
    disabled = false,
    tooltip,
}) => {
    const theme = useTheme();
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
    const propsRef = useRef({ direction, disabled, onDrag, onDragStart, onDragEnd });
    propsRef.current = { direction, disabled, onDrag, onDragStart, onDragEnd };
    const [isDragging, setIsDragging] = useState(false);
    const { state, interaction, focused } = useHudInteraction({ disabled, highlighted: isDragging });
    const borderAppearance = theme.resolveAppearance('outline', color, highlightColor ?? color, state);
    const gripAppearance = theme.resolveAppearance(variant, color, highlightColor ?? color, state);
    const [handleLength, setHandleLength] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setHandleLength(direction === 'horizontal' ? height : width);
    };

    const handleMove = (event: GestureResponderEvent) => {
        const lastPosition = lastPositionRef.current;
        if (!lastPosition || propsRef.current.disabled) {
            return;
        }
        const { pageX, pageY } = event.nativeEvent;
        const delta = propsRef.current.direction === 'horizontal' ? pageX - lastPosition.x : pageY - lastPosition.y;
        lastPositionRef.current = { x: pageX, y: pageY };
        if (delta !== 0) {
            propsRef.current.onDrag(delta);
        }
    };

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

    const isHorizontal = direction === 'horizontal';
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    const handle = (
        <View
            pointerEvents="box-none"
            {...panResponder.panHandlers}
            {...interaction}
            onLayout={handleLayout}
            style={[
                isHorizontal ? styles.horizontalHandle : styles.verticalHandle,
                focused ? {
                    outlineStyle: 'solid',
                    outlineWidth: 2,
                    outlineOffset: 3,
                    outlineColor: borderAppearance.effects.glowColor,
                } : undefined,
            ]}
            accessible
            accessibilityRole="adjustable"
            accessibilityState={{ disabled }}
            accessibilityLabel={typeof tooltip === 'string' ? tooltip : undefined}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(event) => {
                if (!disabled) {
                    onDragStart?.(0);
                    onDrag(event.nativeEvent.actionName === 'increment' ? 10 : -10);
                    onDragEnd?.();
                }
            }}
        >
            <View
                collapsable={false}
                style={isHorizontal ? styles.horizontalEdgeTarget : styles.verticalEdgeTarget}
            >
                <View
                    style={[
                        isHorizontal ? styles.horizontalBorder : styles.verticalBorder,
                        { backgroundColor: borderAppearance.border.color },
                    ]}
                />
            </View>
            {(handleLength >= 500 ? [25, 75] : [50]).map((position) => (
                <View
                    key={position}
                    collapsable={false}
                    style={[
                        styles.gripTarget,
                        isHorizontal
                            ? { top: `${position}%`, left: '50%' }
                            : { left: `${position}%`, top: '50%' },
                    ]}
                >
                    <ResizeHandleGrip
                        position={50}
                        appearance={gripAppearance}
                        direction={direction}
                        side={side}
                    />
                </View>
            ))}
        </View>
    );

    return <Tooltip content={tooltip} color={highlightColor ?? color} placement={gripSide}>{handle}</Tooltip>;
};
