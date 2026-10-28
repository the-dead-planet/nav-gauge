import { FC } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import {
    menuItemLinkIcons,
    MenuItemProps,
    useMenuContext,
    useTheme,
} from '@ui';
import { Icon } from '../../design-system/icons';
import { Text } from '../../design-system/typography';
import { useHudInteraction } from '../../hud/useHudInteraction';

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        flexGrow: 1,
        flexShrink: 1,
    },
});

export const MenuItem: FC<MenuItemProps & Pick<PressableProps, 'onPress'>> = ({
    color,
    highlightColor,
    size,
    selected,
    linkType,
    highlighted = false,
    disabled = false,
    glyphsShade,
    highlightGlyphsShade,
    isFirst: _isFirst,
    closeOnPress = true,
    onPress,
    children,
}) => {
    const context = useMenuContext();
    const theme = useTheme();
    const baseColor = color ?? context.color;
    const interactiveColor =
        highlightColor ?? context.highlightColor ?? baseColor;
    const { state, interaction, focused } = useHudInteraction({
        disabled,
        highlighted: selected || highlighted,
    });
    const appearance = theme.resolveAppearance(
        'menu-item',
        baseColor,
        interactiveColor,
        state,
    );
    const controlSize = theme.sizes.control[size ?? context.size];
    const usesHighlight = state === 'hover-focus' || state === 'active-pressed';
    const overrideShade = usesHighlight ? highlightGlyphsShade : glyphsShade;
    const glyphs =
        disabled || overrideShade === undefined
            ? appearance.glyphs
            : theme.color(
                  usesHighlight ? interactiveColor : baseColor,
                  overrideShade,
              );

    return (
        <Pressable
            {...interaction}
            disabled={disabled}
            accessibilityRole={
                selected === undefined
                    ? linkType
                        ? 'link'
                        : 'button'
                    : 'radio'
            }
            accessibilityState={{ disabled, checked: selected }}
            style={[
                styles.menuItem,
                {
                    minHeight: controlSize.height,
                    paddingHorizontal: controlSize.paddingInline,
                    paddingVertical: controlSize.paddingBlock,
                    gap: controlSize.gap,
                    backgroundColor: appearance.surface,
                    borderColor: appearance.border.color,
                    borderWidth: appearance.border.width,
                    outlineStyle: 'solid',
                    outlineWidth: focused ? 2 : 0,
                    outlineOffset: -2,
                    outlineColor: appearance.effects.glowColor,
                },
            ]}
            onPress={(event) => {
                event.stopPropagation();
                onPress?.(event);
                if (closeOnPress) {
                    context.onClose();
                }
            }}
        >
            <Text
                fontWeight={appearance.fontWeight}
                style={[
                    styles.label,
                    { color: glyphs, fontSize: controlSize.fontSize },
                ]}
            >
                {children}
            </Text>
            {linkType ? (
                <Icon
                    icon={menuItemLinkIcons[linkType]}
                    size={size ?? context.size}
                    color={glyphs}
                />
            ) : null}
        </Pressable>
    );
};
