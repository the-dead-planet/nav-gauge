import { FC, RefObject, useRef, useState } from "react";
import {
    HostInstance,
    TextInput as NativeTextInput,
    View,
    StyleSheet,
} from "react-native";
import {
    colorFormatOptions,
    ColorInputProps,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    FontType,
    Theme,
    useColorInputState,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import { resolveMobileFont } from "../../design-system/typography/fontFamily";
import { useHudInteraction } from "../../hud/useHudInteraction";
import { Dropdown } from "../dropdown";
import { Popup } from "../../rigs/popup";
import { ColorButton } from "../color-button";
import { ColorRamp } from "../color-ramp";

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 0,
        gap: 0,
        padding: 0,
    },
    valueInput: {
        flex: 1,
        alignSelf: "stretch",
        minWidth: 0,
        paddingHorizontal: Number.parseInt(Theme.spacing.xs, 10),
        paddingVertical: 0,
        borderWidth: 0,
        borderRadius: 0,
        fontFamily: resolveMobileFont(FontType.Numeric).fontFamily,
        fontVariant: ["tabular-nums"],
    },
    formatSelect: {
        width: 128,
        alignSelf: "stretch",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    popup: {
        width: 280,
        maxWidth: "90%",
        padding: 8,
        borderRadius: 0,
    },
});

export const ColorInput: FC<ColorInputProps> = ({
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    value,
    onChange,
    disabled = false,
    highlighted = false,
    showColorButton = true,
    showValueInput = true,
    showFormatSelect = false,
}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HostInstance>(null);
    const { draft, format, invalid, changeDraft, changeFormat, changeColor } =
        useColorInputState(value, onChange);
    const { state, interaction, pointerInteraction, focused } =
        useHudInteraction({
            disabled,
            highlighted,
        });
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
        glyphsShade,
        highlightGlyphsShade,
    );
    const controlSize = theme.sizes.control[size];

    return (
        <>
            <View style={styles.container}>
                <Label
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    highlighted={highlighted}
                    disabled={disabled}
                    style={{ fontSize: controlSize.fontSize }}
                >
                    {label}
                </Label>
                <View
                    style={[
                        styles.wrapper,
                        {
                            height: controlSize.height,
                            backgroundColor: appearance.surface,
                            borderColor: appearance.border.color,
                            borderWidth: appearance.border.width,
                            outlineStyle: "solid",
                            outlineWidth:
                                !disabled && (invalid || focused) ? 2 : 0,
                            outlineOffset: 2,
                            outlineColor: invalid
                                ? theme.color("glitch", 500)
                                : appearance.effects.glowColor,
                        },
                    ]}
                >
                    {showColorButton ? (
                        <ColorButton
                            ref={anchorRef}
                            value={value}
                            label={label}
                            size={size}
                            selected={open || highlighted}
                            disabled={disabled}
                            accessibilityState={{
                                disabled,
                                expanded: open && !disabled,
                            }}
                            onPress={() => setOpen((current) => !current)}
                        />
                    ) : null}
                    {showValueInput && showFormatSelect ? (
                        <View style={styles.formatSelect}>
                            <Dropdown
                                value={format}
                                options={colorFormatOptions}
                                size={size}
                                variant={variant}
                                color={color}
                                highlightColor={highlightColor}
                                glyphsShade={glyphsShade}
                                highlightGlyphsShade={highlightGlyphsShade}
                                disabled={disabled}
                                highlighted={highlighted}
                                onChange={changeFormat}
                            />
                        </View>
                    ) : null}
                    {showValueInput ? (
                        <NativeTextInput
                            {...pointerInteraction}
                            value={draft}
                            editable={!disabled}
                            accessibilityLabel={label}
                            accessibilityState={{ disabled }}
                            onFocus={interaction.onFocus}
                            onBlur={interaction.onBlur}
                            onPressIn={interaction.onPressIn}
                            onPressOut={interaction.onPressOut}
                            style={[
                                styles.valueInput,
                                {
                                    color: appearance.glyphs,
                                    fontSize: controlSize.fontSize,
                                },
                            ]}
                            onChangeText={changeDraft}
                        />
                    ) : null}
                </View>
            </View>
            {showColorButton ? (
                <Popup
                    visible={open && !disabled}
                    anchor={
                        anchorRef as unknown as RefObject<HTMLElement | null>
                    }
                    color={color}
                    variant="fill-inverse"
                    triggerAnchor="bottom-left"
                    popupAnchor="top-left"
                    onClose={() => setOpen(false)}
                    overlayStyle={styles.overlay}
                    popupStyle={styles.popup}
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
