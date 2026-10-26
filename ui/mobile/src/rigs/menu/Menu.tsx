import { ComponentProps, FC } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    getIconAndMenuAnchors,
    Icons,
    MenuContext,
    MenuProps,
    useTheme,
} from '@ui';
import { Button } from '../../gizmos/button';
import { resolveLayerStyle } from '../../design-system/theme';
import { useMenu } from './useMenu';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    modalOverlay: {
        flex: 1,
    },
    menuList: {
        position: 'absolute',
        minWidth: 160,
        maxHeight: 240,
    },
});

interface MobileMenuProps extends MenuProps {
    triggerStyle?: StyleProp<ViewStyle>;
}

export const Menu: FC<MobileMenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    color = DEFAULT_COLOR,
    size = iconSize ?? DEFAULT_SIZE,
    variant = 'ghost',
    highlightColor = iconActiveColor ?? color,
    glyphsShade,
    highlightGlyphsShade,
    highlighted = false,
    tooltip,
    tooltipPlacement,
    triggerAccessibilityLabel,
    triggerActive = false,
    disabled = false,
    triggerStyle,
    children,
}) => {
    const { icon: triggerAnchor, menu: popupAnchor } =
        getIconAndMenuAnchors(placement);
    const {
        visible,
        triggerRef,
        overlayRef,
        popupPosition,
        onLayout,
        toggle,
        close,
    } = useMenu({ disabled, triggerAnchor, popupAnchor });
    const theme = useTheme();
    const appearance = theme.resolveAppearance('fill-inverse', color);

    return (
        <View style={styles.container}>
            <View ref={triggerRef} collapsable={false}>
                <Button
                    variant={variant}
                    icon={icon as ComponentProps<typeof Button>['icon']}
                    color={color}
                    highlightColor={highlightColor}
                    glyphsShade={glyphsShade}
                    highlightGlyphsShade={highlightGlyphsShade}
                    tooltip={tooltip}
                    tooltipPlacement={tooltipPlacement}
                    size={size}
                    highlighted={visible || triggerActive || highlighted}
                    disabled={disabled}
                    accessibilityLabel={triggerAccessibilityLabel}
                    accessibilityState={{ disabled, expanded: visible }}
                    onPress={toggle}
                    style={triggerStyle}
                />
            </View>
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={close}
            >
                <Pressable
                    ref={overlayRef}
                    style={styles.modalOverlay}
                    onPress={close}
                >
                    <ScrollView
                        onLayout={onLayout}
                        contentContainerStyle={{
                            paddingVertical:
                                theme.sizes.control[size].paddingBlock,
                        }}
                        style={[
                            styles.menuList,
                            resolveLayerStyle(theme, 'dropdown'),
                            popupPosition,
                            {
                                backgroundColor: appearance.surface,
                                borderColor: appearance.border.color,
                                borderWidth: appearance.border.width,
                            },
                        ]}
                    >
                        <MenuContext.Provider
                            value={{
                                color,
                                highlightColor,
                                size,
                                onClose: close,
                            }}
                        >
                            {children}
                        </MenuContext.Provider>
                    </ScrollView>
                </Pressable>
            </Modal>
        </View>
    );
};
