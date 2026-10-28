import { FC, RefObject } from 'react';
import {
    Animated,
    HostInstance,
    Modal,
    Pressable,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { DEFAULT_COLOR, DEFAULT_FILL_VARIANT, PopupProps, useTheme } from '@ui';
import { HudContent } from '../../hud/HudContent';
import { resolveLayerStyle } from '../../design-system/theme';
import { usePopupPosition } from './usePopupPosition';
import { usePopupTransition } from './usePopupTransition';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    popup: {
        position: 'absolute',
    },
    content: {
        flexShrink: 1,
    },
});

interface Props extends PopupProps {
    modal?: boolean;
    overlayStyle?: StyleProp<ViewStyle>;
    popupStyle?: StyleProp<ViewStyle>;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    triggerAnchor = 'top-left',
    popupAnchor = 'bottom-left',
    dismissOnClickAway = true,
    visible,
    onClose,
    modal = true,
    overlayStyle,
    popupStyle,
    children,
    variant = DEFAULT_FILL_VARIANT,
    color = DEFAULT_COLOR,
    highlightColor = color,
    highlighted = false,
    disabled = false,
    borderWidth,
}) => {
    const theme = useTheme();
    const layer = resolveLayerStyle(theme, 'popup');
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        disabled ? 'disabled' : highlighted ? 'active-pressed' : 'default',
    );
    const { overlayRef, popupPosition, onLayout } = usePopupPosition({
        visible,
        anchor: anchor as unknown as RefObject<HostInstance | null>,
        position,
        triggerAnchor,
        popupAnchor,
    });
    const animatedStyle = usePopupTransition(visible, popupAnchor);
    const overlayStyles: StyleProp<ViewStyle> = [
        styles.overlay,
        { zIndex: layer.zIndex },
        overlayStyle,
    ];
    const popup = (
        <Animated.View
            onLayout={onLayout}
            style={[
                styles.popup,
                layer,
                {
                    backgroundColor: appearance.surface,
                    borderColor: appearance.border.color,
                    borderWidth:
                        appearance.border.width * Math.max(0, borderWidth ?? 1),
                },
                popupPosition,
                animatedStyle,
                popupStyle,
            ]}
        >
            <Pressable
                style={styles.content}
                onPress={(event) => event.stopPropagation()}
            >
                <HudContent appearance={appearance}>{children}</HudContent>
            </Pressable>
        </Animated.View>
    );

    if (!modal) {
        return visible ? (
            <View
                ref={overlayRef}
                pointerEvents="box-none"
                style={overlayStyles}
            >
                {popup}
            </View>
        ) : null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable
                ref={overlayRef}
                style={overlayStyles}
                onPress={dismissOnClickAway ? onClose : undefined}
            >
                {popup}
            </Pressable>
        </Modal>
    );
};
