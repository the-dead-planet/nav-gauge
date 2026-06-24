import { ComponentType, useCallback, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    View,
    ViewStyle,
} from "react-native";
import { DropdownProps, Icons, useTheme } from "@ui";
import { Icon } from "../icons";
import { Text } from "../typography";
import { SvgProps } from "react-native-svg";

interface MobileOption<T> {
    value: T;
    label: string;
    icon?: ComponentType<SvgProps>;
}

const SIZE_MAP = {
    md: { height: 32, paddingV: 6, paddingH: 12, gap: 10, fontSize: 14 },
    sm: { height: 24, paddingV: 2, paddingH: 10, gap: 6, fontSize: 14 },
    xs: { height: 18, paddingV: 0, paddingH: 8, gap: 4, fontSize: 12 },
} as const;

const ICON_SIZE_MAP = { xs: 12, sm: 16, md: 20 } as const;

export function Dropdown<T>({
    color = 'neutral',
    highlightColor: hlColor,
    size = 'sm',
    variant = 'fill-inverse',
    value,
    options,
    onChange,
    placeholder = 'Select...',
    disabled = false,
}: Omit<DropdownProps<T>, 'options'> & { options: MobileOption<T>[] }) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);
    const [menuWidth, setMenuWidth] = useState(0);
    const triggerRef = useRef<View>(null);

    const highlightColor = hlColor ?? color;
    const selectedOption = options.find(o => o.value === value);
    const s = SIZE_MAP[size];
    const iconSize = ICON_SIZE_MAP[size];
    const baseColor = theme.color(color, 500);

    const getTriggerStyle = (pressed: boolean): ViewStyle => {
        const style: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            height: s.height,
            paddingHorizontal: s.paddingH,
            paddingVertical: s.paddingV,
            gap: s.gap,
            borderRadius: 4,
        };

        switch (variant) {
            case 'fill':
                style.backgroundColor = pressed
                    ? theme.color(highlightColor, 300)
                    : baseColor;
                style.borderWidth = 0;
                break;
            case 'fill-inverse':
                style.borderWidth = 1;
                style.backgroundColor = theme.color(
                    color,
                    theme.isLight ? 100 : (color === 'neutral' ? 800 : 900)
                );
                style.borderColor = pressed
                    ? theme.color(highlightColor, theme.isLight ? 600 : 300)
                    : baseColor;
                break;
            case 'fill-translucent':
                style.borderWidth = 1;
                style.backgroundColor = theme.color(color, 500, 0.24);
                style.borderColor = pressed
                    ? theme.color(highlightColor, theme.isLight ? 600 : 300)
                    : theme.color(color, 500, 0.3);
                break;
        }

        return style;
    };

    const getTextColor = (pressed: boolean): string => {
        if (variant === 'fill') {
            return theme.color(color, 900);
        }
        return pressed
            ? theme.color(highlightColor, theme.isLight ? 600 : 300)
            : baseColor;
    };

    const handleOpen = useCallback(() => {
        if (triggerRef.current) {
            triggerRef.current.measureInWindow((x, y, w, h) => {
                setMenuTop(y + h);
                setMenuLeft(x);
                setMenuWidth(w);
                setIsOpen(true);
            });
        }
    }, []);

    return (
        <View>
            <View ref={triggerRef} collapsable={false}>
                <Pressable
                    disabled={disabled}
                    onPress={handleOpen}
                    style={({ pressed }) => [
                        getTriggerStyle(pressed),
                        disabled && { opacity: 0.4 },
                    ]}
                >
                    {({ pressed }) => (
                        <>
                            {selectedOption?.icon ? (
                                <Icon
                                    icon={selectedOption.icon}
                                    width={iconSize}
                                    height={iconSize}
                                    color={getTextColor(pressed)}
                                />
                            ) : null}
                            <Text
                                style={{
                                    color: getTextColor(pressed),
                                    fontSize: s.fontSize,
                                    lineHeight: s.fontSize * 1.1,
                                    flex: 1,
                                }}
                            >
                                {selectedOption ? selectedOption.label : placeholder}
                            </Text>
                            <Icon
                                icon={Icons.NounProject.ChevronDownDoubleSquareFill}
                                width={iconSize}
                                height={iconSize}
                                color={getTextColor(pressed)}
                            />
                        </>
                    )}
                </Pressable>
            </View>

            <Modal visible={isOpen} transparent animationType="fade">
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setIsOpen(false)}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: menuTop,
                            left: menuLeft,
                            width: menuWidth,
                            marginTop: 4,
                            borderRadius: 4,
                            backgroundColor: theme.componentColor('menu-background'),
                            borderWidth: 1,
                            borderColor: baseColor,
                            paddingVertical: 4,
                            maxHeight: 240,
                            shadowColor: theme.componentColor('box-shadow'),
                            shadowOffset: { width: 5, height: 5 },
                            shadowOpacity: 0.6,
                            shadowRadius: 1,
                            elevation: 10,
                        }}
                    >
                        <ScrollView>
                            {options.map((option) => {
                                const selected = option.value === value;
                                return (
                                    <Pressable
                                        key={String(option.value)}
                                        onPress={() => {
                                            onChange?.(option.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: s.gap,
                                                paddingVertical: 4,
                                                paddingHorizontal: 10,
                                                backgroundColor: selected
                                                    ? theme.color(highlightColor, 500, 0.1)
                                                    : 'transparent',
                                            }}
                                        >
                                            {option.icon ? (
                                                <Icon
                                                    icon={option.icon}
                                                    width={iconSize}
                                                    height={iconSize}
                                                    color={selected
                                                        ? theme.color(highlightColor, 500)
                                                        : baseColor
                                                    }
                                                />
                                            ) : null}
                                            <Text
                                                style={{
                                                    color: selected
                                                        ? theme.color(highlightColor, 500)
                                                        : baseColor,
                                                    fontSize: s.fontSize,
                                                    lineHeight: s.fontSize * 1.1,
                                                }}
                                            >
                                                {option.label}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
