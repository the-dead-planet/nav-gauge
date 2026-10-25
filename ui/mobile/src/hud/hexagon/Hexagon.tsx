import { forwardRef } from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewInstance } from 'react-native';
import { DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT, hexagonGeometry, HexagonProps, useTheme } from '@ui';
import { useHudInteraction } from '../useHudInteraction';
import { HexagonSurface } from './HexagonSurface';

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const Hexagon = forwardRef<ViewInstance, HexagonProps & Omit<PressableProps, 'children'>>(({
    shape = 'pointy-top',
    strokeWidth,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_SURFACE_VARIANT,
    activeGlow = 'none',
    interactive = false,
    highlighted = false,
    disabled = false,
    onPress,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    accessibilityState,
    accessibilityRole,
    style,
    children,
    ...props
}, ref) => {
    const theme = useTheme();
    const { state, interaction } = useHudInteraction({ disabled, highlighted, onPressIn, onPressOut, onHoverIn, onHoverOut, onFocus, onBlur });
    const appearance = theme.resolveAppearance(variant, color, highlightColor ?? color, state);
    const containerStyle = [styles.container, { aspectRatio: hexagonGeometry[shape].aspectRatio, height: theme.sizes.control[size].height }];
    const content = (
        <HexagonSurface
            shape={shape}
            strokeWidth={strokeWidth}
            appearance={appearance}
            showGlow={activeGlow !== 'none' && (state === 'active-pressed' || state === 'hover-focus')}
        >
            {children}
        </HexagonSurface>
    );

    return interactive || onPress ? (
        <Pressable
            {...props}
            {...interaction}
            ref={ref}
            disabled={disabled}
            onPress={onPress}
            accessibilityRole={accessibilityRole ?? (onPress ? 'button' : undefined)}
            accessibilityState={{ ...accessibilityState, disabled }}
            style={(pressState) => [...containerStyle, typeof style === 'function' ? style(pressState) : style]}
        >
            {content}
        </Pressable>
    ) : (
        <View
            {...props}
            ref={ref}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ ...accessibilityState, disabled }}
            style={[...containerStyle, typeof style === 'function' ? undefined : style]}
        >
            {content}
        </View>
    );
});
