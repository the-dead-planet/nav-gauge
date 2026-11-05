import { ComponentType, ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    DropdownProps,
} from "@ui";
import { SvgProps } from "react-native-svg";
import { MenuList } from "../../rigs/menu/MenuList";
import { DropdownControl } from "./DropdownControl";
import { useDropdown } from "./useDropdown";

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
    },
});

interface MobileOption<T> {
    value: T;
    label: string;
    prepend?: ReactNode;
    selectedPrepend?: ReactNode;
    icon?: ComponentType<SvgProps>;
}

export function Dropdown<T>({
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    value,
    options,
    onChange,
    placeholder = "Select...",
    disabled = false,
    highlighted = false,
}: Omit<DropdownProps<T>, "options"> & { options: MobileOption<T>[] }) {
    const {
        visible: isOpen,
        triggerRef,
        overlayRef,
        toggle,
        close,
        onLayout,
        onTriggerLayout,
        menuPosition,
    } = useDropdown(disabled);
    const selectedOption = options.find((option) => option.value === value);
    const controlProps = {
        color,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        size,
        variant,
    };

    return (
        <View>
            <View
                ref={triggerRef}
                collapsable={false}
                onLayout={onTriggerLayout}
            >
                <DropdownControl
                    {...controlProps}
                    trigger
                    expanded={isOpen}
                    disabled={disabled}
                    highlighted={highlighted || isOpen}
                    label={selectedOption?.label ?? placeholder}
                    icon={selectedOption?.icon}
                    prepend={
                        selectedOption?.selectedPrepend ??
                        selectedOption?.prepend
                    }
                    onPress={toggle}
                />
            </View>
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={close}
            >
                <Pressable
                    ref={overlayRef}
                    accessible={false}
                    style={styles.backdrop}
                    onPress={close}
                >
                    <MenuList
                        color={color}
                        size={size}
                        accessibilityViewIsModal
                        onLayout={onLayout}
                        style={menuPosition}
                    >
                        {options.map((option) => (
                            <DropdownControl
                                {...controlProps}
                                key={String(option.value)}
                                highlighted={option.value === value}
                                label={option.label}
                                icon={option.icon}
                                prepend={option.prepend}
                                onPress={() => {
                                    onChange?.(option.value);
                                    close();
                                }}
                            />
                        ))}
                    </MenuList>
                </Pressable>
            </Modal>
        </View>
    );
}
