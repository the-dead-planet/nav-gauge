import { ComponentType, ReactNode } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";
import { AppearanceProps, FillVariant, Icons, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { Text } from "../../design-system/typography";
import { useHudInteraction } from "../../hud/useHudInteraction";

const styles = StyleSheet.create({
    control: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 0,
    },
    label: {
        flex: 1,
    },
});

interface Props
    extends
        Omit<AppearanceProps<FillVariant>, "color" | "variant" | "size">,
        Required<
            Pick<AppearanceProps<FillVariant>, "color" | "variant" | "size">
        > {
    label: string;
    icon?: ComponentType<SvgProps>;
    prepend?: ReactNode;
    trigger?: boolean;
    expanded?: boolean;
    onPress: PressableProps["onPress"];
}

export function DropdownControl({
    color,
    highlightColor,
    variant,
    size,
    glyphsShade,
    highlightGlyphsShade,
    disabled,
    highlighted,
    label,
    icon,
    prepend,
    trigger = false,
    expanded,
    onPress,
}: Props) {
    const theme = useTheme();
    const { state, interaction, focused } = useHudInteraction({
        disabled,
        highlighted,
    });
    const appearance = theme.resolveAppearance(
        trigger ? variant : "menu-item",
        color,
        highlightColor ?? color,
        state,
    );
    const interactive = state === "hover-focus" || state === "active-pressed";
    const shade = interactive ? highlightGlyphsShade : glyphsShade;
    const glyphs =
        !disabled && shade !== undefined
            ? theme.color(
                  interactive ? (highlightColor ?? color) : color,
                  shade,
              )
            : appearance.glyphs;
    const controlSize = theme.sizes.control[size];

    return (
        <Pressable
            {...interaction}
            disabled={disabled}
            onPress={(event) => {
                if (!trigger) {
                    event.stopPropagation();
                }
                onPress?.(event);
            }}
            accessibilityRole={trigger ? "combobox" : "menuitem"}
            accessibilityState={{
                disabled,
                expanded,
                selected: trigger ? undefined : highlighted,
            }}
            accessibilityValue={trigger ? { text: label } : undefined}
            style={[
                styles.control,
                {
                    height: controlSize.height,
                    paddingHorizontal: controlSize.paddingInline,
                    paddingVertical: controlSize.paddingBlock,
                    gap: controlSize.gap,
                    backgroundColor: appearance.surface,
                    borderColor: appearance.border.color,
                    borderWidth: appearance.border.width,
                    outlineStyle: "solid",
                    outlineWidth: focused ? 2 : 0,
                    outlineOffset: trigger ? 3 : -2,
                    outlineColor: appearance.effects.glowColor,
                },
            ]}
        >
            {prepend}
            {icon ? (
                <Icon
                    icon={icon}
                    width={controlSize.iconSize}
                    height={controlSize.iconSize}
                    color={glyphs}
                />
            ) : null}
            <Text
                numberOfLines={1}
                fontWeight={appearance.fontWeight}
                style={[
                    styles.label,
                    {
                        color: glyphs,
                        fontSize: controlSize.fontSize,
                        lineHeight: controlSize.fontSize * 1.1,
                    },
                ]}
            >
                {label}
            </Text>
            {trigger ? (
                <Icon
                    icon={Icons.NounProject.ChevronDownDoubleSquareFill}
                    width={controlSize.iconSize}
                    height={controlSize.iconSize}
                    color={glyphs}
                    rotation={expanded ? 180 : 0}
                />
            ) : null}
        </Pressable>
    );
}
