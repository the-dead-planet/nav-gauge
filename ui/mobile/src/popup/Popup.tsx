import { FC, useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { getMenuPosition, MenuPosition, MenuAnchor, getIconAnchorPoint, PopupProps } from '@ui';

interface Props extends PopupProps {
    overlayStyle?: StyleProp<ViewStyle>;
    popupStyle?: StyleProp<ViewStyle>;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    placement = 'top-left',
    dismissOnClickAway = true,
    visible,
    onClose,
    overlayStyle,
    popupStyle,
    children,
}) => {
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) {
            return;
        }

        let iconAnchor: { x: number; y: number };

        if (position) {
            iconAnchor = position;
        } else if (anchor && anchor.current) {
            const rect = (anchor.current as unknown as { getBoundingClientRect?: () => DOMRect })?.getBoundingClientRect?.();
            if (rect) {
                iconAnchor = getIconAnchorPoint(placement, rect.left, rect.top, rect.width, rect.height);
            } else {
                return;
            }
        } else {
            return;
        }

        const menuAnchor = placement.startsWith('top') ? 'bottom' : 'top';
        const horizontal = placement.endsWith('right') ? 'right' : 'left';
        const menuAnchorKey = `${menuAnchor}-${horizontal}` as MenuAnchor;

        setMenuPosition(getMenuPosition(menuAnchorKey, iconAnchor, windowWidth, windowHeight));
    }, [visible, anchor, position, placement, windowWidth, windowHeight]);

    useEffect(() => {
        if (visible) {
            Animated.timing(animValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                onClose();
            });
        }
    }, [visible]);

    const slide = menuPosition.bottom ? 'to-top' : 'to-bottom';

    const interpolatedY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: menuPosition.bottom ? [100, 0] : [-100, 0],
    });

    const opacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const animatedStyle: StyleProp<ViewStyle> = {
        transform: [{ translateY: interpolatedY }],
        opacity: opacity as unknown as number,
    };

    const positionStyle: StyleProp<ViewStyle> = {
        ...(menuPosition.top !== undefined && { top: menuPosition.top }),
        ...(menuPosition.left !== undefined && { left: menuPosition.left }),
        ...(menuPosition.right !== undefined && { right: menuPosition.right }),
        ...(menuPosition.bottom !== undefined && { bottom: menuPosition.bottom }),
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable
                style={[styles.overlay, overlayStyle]}
                onPress={dismissOnClickAway ? onClose : undefined}
            >
                <Animated.View
                    style={[styles.popup, positionStyle, animatedStyle, popupStyle]}
                >
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {children}
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = {
    overlay: {
        flex: 1,
        position: 'absolute' as const,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
    } as ViewStyle,
    popup: {
        position: 'absolute' as const,
    } as ViewStyle,
};
