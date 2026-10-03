import { FC, RefObject, useRef, useState } from "react";
import { HostInstance, TextInput as NativeTextInput, View, StyleSheet } from "react-native";
import { ColorFormat, ColorInputProps, parseColor, toCssColor, useColorInputState, useTheme } from "@ui";
import { Text } from "../../typography";
import { Dropdown } from "../../dropdown";
import { Popup } from "../../popup";
import { ColorButton } from "../color-button";
import { ColorRamp } from "../color-ramp";

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 0,
        gap: 0,
        padding: 0,
    },
    valueInput: {
        flex: 1,
        alignSelf: 'stretch',
        minWidth: 0,
        paddingHorizontal: 8,
        paddingVertical: 0,
        borderWidth: 0,
        borderRadius: 0,
        fontFamily: 'monospace',
        fontSize: 12,
    },
    formatSelect: {
        width: 84,
        alignSelf: 'stretch',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    popup: {
        width: 280,
        maxWidth: '90%',
        padding: 8,
        borderWidth: 1,
        borderRadius: 0,
    },
});

const inputHeights = { xs: 18, sm: 24, md: 32 } as const;
const formatOptions: { value: ColorFormat; label: string }[] = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'rgba', label: 'RGBA' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsla', label: 'HSLA' },
];

export const ColorInput: FC<ColorInputProps> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    showColorButton = true,
    showValueInput = true,
    showFormatSelect = false,
}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HostInstance>(null);
    const { draft, format, invalid, changeDraft, changeFormat, changeColor } = useColorInputState(value, onChange);
    const borderColor = theme.color(color, 500);
    const inverseBackgroundColor = theme.color(color, theme.isLight ? 100 : 900);
    const backgroundColor = variant === 'fill'
        ? borderColor
        : variant === 'fill-translucent'
            ? toCssColor({ ...parseColor(borderColor), a: .24 })
            : inverseBackgroundColor;
    const inputBorderColor = variant === 'fill-translucent'
        ? toCssColor({ ...parseColor(borderColor), a: .3 })
        : borderColor;
    const wrapperBackgroundColor = variant === 'fill-translucent' ? 'transparent' : backgroundColor;
    const textColor = variant === 'fill'
        ? inverseBackgroundColor
        : theme.color(color, theme.isLight ? 900 : 100);

    return (
        <>
            <View style={styles.container}>
                <Text style={[styles.label, { fontSize: size === 'xs' ? 11 : 12 }]}>{label}</Text>
                <View
                    style={[
                        styles.wrapper,
                        {
                            backgroundColor: wrapperBackgroundColor,
                            borderColor: invalid ? theme.componentColor('error') : inputBorderColor,
                            height: inputHeights[size],
                            opacity: disabled ? .4 : 1,
                        },
                    ]}
                >
                    {showColorButton ? (
                        <ColorButton
                            ref={anchorRef}
                            value={value}
                            label={label}
                            size={size}
                            selected={open}
                            disabled={disabled}
                            accessibilityState={{ disabled, expanded: open }}
                            onPress={() => setOpen((current) => !current)}
                        />
                    ) : null}
                    {showValueInput && showFormatSelect ? (
                        <View style={styles.formatSelect}>
                            <Dropdown
                                value={format}
                                options={formatOptions}
                                size={size}
                                variant={variant}
                                color={color}
                                highlightColor={highlightColor}
                                disabled={disabled}
                                onChange={changeFormat}
                            />
                        </View>
                    ) : null}
                    {showValueInput ? (
                        <NativeTextInput
                            value={draft}
                            editable={!disabled}
                            accessibilityLabel={label}
                            accessibilityState={{ disabled }}
                            style={[
                                styles.valueInput,
                                {
                                    color: textColor,
                                    backgroundColor: variant === 'fill-translucent' ? backgroundColor : 'transparent',
                                    fontSize: size === 'xs' ? 10 : size === 'sm' ? 11 : 12,
                                },
                            ]}
                            onChangeText={changeDraft}
                        />
                    ) : null}
                </View>
            </View>
            {showColorButton ? (
                <Popup
                    visible={open}
                    anchor={anchorRef as unknown as RefObject<HTMLElement | null>}
                    triggerAnchor="bottom-left"
                    popupAnchor="top-left"
                    onClose={() => setOpen(false)}
                    overlayStyle={styles.overlay}
                    popupStyle={[
                        styles.popup,
                        {
                            backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                            borderColor: theme.componentColor('border'),
                        },
                    ]}
                >
                    {open ? (
                        <ColorRamp
                            value={value}
                            label={label}
                            size={size}
                            disabled={disabled}
                            onChange={changeColor}
                        />
                    ) : null}
                </Popup>
            ) : null}
        </>
    );
};
