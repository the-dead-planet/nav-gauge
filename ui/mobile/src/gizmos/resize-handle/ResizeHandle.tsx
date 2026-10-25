import { FC, useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, StyleSheet, View } from "react-native";
import { DEFAULT_COLOR, ResizeHandleProps, useTheme } from "@ui";
import { ResizeHandleGrip } from "./ResizeHandleGrip";
import { Tooltip } from "../tooltip";
import { useHudInteraction } from '../../hud/useHudInteraction';

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
});

export const ResizeHandle: FC<ResizeHandleProps> = ({
    direction = 'horizontal',
    side,
    color = DEFAULT_COLOR,
    highlightColor,
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
    const appearance = theme.resolveAppearance(undefined, color, highlightColor ?? color, state);
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
            {...panResponder.panHandlers}
            {...interaction}
            onLayout={handleLayout}
            style={[
                isHorizontal ? styles.horizontalHandle : styles.verticalHandle,
                focused ? {
                    outlineStyle: 'solid',
                    outlineWidth: 2,
                    outlineOffset: 3,
                    outlineColor: appearance.effects.glowColor,
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
                style={[
                    isHorizontal ? styles.horizontalBorder : styles.verticalBorder,
                    { backgroundColor: appearance.glyphs },
                ]}
            />
            {(handleLength >= 500 ? [25, 75] : [50]).map((position) => (
                <ResizeHandleGrip
                    key={position}
                    position={position}
                    appearance={appearance}
                    direction={direction}
                    side={side}
                />
            ))}
        </View>
    );

    return <Tooltip content={tooltip} color={highlightColor ?? color} placement={gripSide}>{handle}</Tooltip>;
};
