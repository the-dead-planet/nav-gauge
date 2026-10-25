import { useState, useRef, FC, ComponentProps } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Pressable,
    LayoutChangeEvent,
    StyleProp,
    useWindowDimensions,
    type HostInstance,
    ViewStyle,
} from 'react-native';
import {
    useTheme,
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    placePopup,
    MenuProps,
    Icons,
    DEFAULT_COLOR,
} from '@ui';
import { Button } from '../../gizmos/button';
import { resolveLayerStyle } from '../../design-system/theme';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
    },
    menuList: {
        position: 'absolute',
        paddingVertical: 4,
        minWidth: 160,
        maxHeight: 240,
        borderWidth: 1,
    }
});

interface MobileMenuProps extends MenuProps {
    triggerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export const Menu: FC<MobileMenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    color = DEFAULT_COLOR,
    triggerAccessibilityLabel,
    triggerActive = false,
    disabled = false,
    triggerStyle,
    children,
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const theme = useTheme();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [visible, setVisible] = useState<boolean>(false);
    const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number } | null>(null);
    const [menuSize, setMenuSize] = useState<{ width: number; height: number } | null>(null);

    const iconWrapperRef = useRef<HostInstance>(null);

    const toggleMenu = (): void => {
        if (disabled) {
            return;
        }
        if (visible) {
            setVisible(false);
            return;
        }
        iconWrapperRef.current?.measureInWindow((x, y, width, height) => {
            setAnchorPoint(getIconAnchorPoint(iconAnchor, x, y, width, height));
            setVisible(true);
        });
    };

    const handleMenuLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setMenuSize({ width, height });
    };
    const menuPosition: MenuPosition = anchorPoint
        ? placePopup(menuAnchor, anchorPoint, menuSize, windowWidth, windowHeight).position
        : {};

    return (
        <View style={styles.container}>
            <View ref={iconWrapperRef}>
                <Button
                    variant="ghost"
                    icon={icon as ComponentProps<typeof Button>['icon']}
                    color={color}
                    highlightColor={iconActiveColor}
                    size={iconSize}
                    highlighted={visible || triggerActive}
                    disabled={disabled}
                    accessibilityLabel={triggerAccessibilityLabel}
                    accessibilityRole="button"
                    accessibilityState={{ disabled, expanded: visible }}
                    onPress={toggleMenu}
                    style={[styles.iconButton, triggerStyle]}
                />
            </View>

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
            >
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View
                        onLayout={handleMenuLayout}
                        style={[
                            styles.menuList,
                            {
                                ...menuPosition,
                                backgroundColor: theme.color(
                                    color,
                                    theme.isLight ? 100 : (color === 'neutral' ? 800 : 900)
                                ),
                                borderColor: theme.color(color, 500),
                                ...resolveLayerStyle(theme, 'dropdown'),
                            }
                        ]}
                    >
                        <MenuContext.Provider value={{ color, onClose: () => setVisible(false) }}>
                            {children}
                        </MenuContext.Provider>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
