import { ComponentProps, FC } from "react";
import {
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    getIconAndMenuAnchors,
    Icons,
    MenuContext,
    MenuProps,
} from "@ui";
import { Button } from "../../gizmos/button";
import { useMenu } from "./useMenu";
import { MenuList } from "./MenuList";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    modalOverlay: {
        flex: 1,
    },
    menuList: {
        minWidth: 160,
    },
});

interface MobileMenuProps extends MenuProps {
    triggerStyle?: StyleProp<ViewStyle>;
}

export const Menu: FC<MobileMenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = "bottom-right",
    color = DEFAULT_COLOR,
    size = iconSize ?? DEFAULT_SIZE,
    variant = "ghost",
    highlightColor = color,
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

    return (
        <View style={styles.container}>
            <View ref={triggerRef} collapsable={false}>
                <Button
                    variant={variant}
                    icon={icon as ComponentProps<typeof Button>["icon"]}
                    color={color}
                    highlightColor={iconActiveColor ?? highlightColor}
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
                    <MenuList
                        color={color}
                        size={size}
                        onLayout={onLayout}
                        style={[styles.menuList, popupPosition]}
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
                    </MenuList>
                </Pressable>
            </Modal>
        </View>
    );
};
