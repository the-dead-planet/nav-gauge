import { Children, ComponentType, FC, Ref } from "react";
import {
    Pressable,
    PressableProps,
    View,
    StyleSheet,
    type ViewInstance,
} from "react-native";
import { ButtonProps, DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT, hexagonGeometry, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { SvgProps } from "react-native-svg";
import { HexagonSurface } from '../../hud/hexagon/HexagonSurface';
import { useHudInteraction } from '../../hud/useHudInteraction';
import { Tooltip } from "../tooltip";
import { MutableViewStyle } from "../../model";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    },
});

export interface MobileButtonProps {
    forwardRef?: Ref<ViewInstance>;
    icon?: ComponentType<SvgProps>;
    title?: string;
}

export const Button: FC<PressableProps & ButtonProps & MobileButtonProps> = ({
    forwardRef,
    color = DEFAULT_COLOR,
    fontType,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    variant = DEFAULT_SURFACE_VARIANT,
    activeGlow = "none",
    size = DEFAULT_SIZE,
    corners = "square",
    highlighted = false,
    title,
    icon,
    iconRotateX = 0,
    iconRotateZ = 0,
    children,
    style,
    disabled,
    tooltip,
    tooltipPlacement,
    showTooltipConnection,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    ...props
}) => {
    const theme = useTheme();
    const { state, interaction, focused } = useHudInteraction({ disabled, highlighted, onPressIn, onPressOut, onHoverIn, onHoverOut, onFocus, onBlur });
    const isInteractiveState = state === 'active-pressed' || state === 'hover-focus';
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
    );
    const showGlow =
        activeGlow !== "none" && isInteractiveState;

    const showTextGlow = showGlow && appearance.effects.glyphsGlow;
    const controlSize = theme.sizes.control[size];

    const container: MutableViewStyle = {
        height: controlSize.height,
        minWidth: icon ? controlSize.height : undefined,
        paddingHorizontal: !(children ?? title)
            ? controlSize.iconPaddingInline
            : controlSize.paddingInline,
        paddingVertical: controlSize.paddingBlock,
        gap: controlSize.gap,
        backgroundColor: appearance.surface,
        borderColor: appearance.border.color,
        borderWidth: appearance.border.width,
        outlineStyle: 'solid',
        outlineWidth: focused ? 2 : 0,
        outlineOffset: 3,
        outlineColor: appearance.effects.glowColor,
    };

    if (appearance.effects.depth === "inset") {
        container.boxShadow = `3px 3px 4px ${appearance.effects.inset.shadow} inset, -2px -2px 4px ${appearance.effects.inset.highlight} inset`;
    }

    if (corners === "circle") {
        container.borderRadius = (container.height as number) / 2;
        container.width = container.height;
        container.paddingHorizontal = 0;
    }

    if (showGlow && corners !== "hexagon") {
        const glowBoxShadow = `0px 0px 4px ${appearance.effects.glowColor}, 0px 0px 20px ${appearance.effects.glowColor}`;
        if (container.boxShadow) {
            container.boxShadow = `${container.boxShadow}, ${glowBoxShadow}`;
        } else {
            container.boxShadow = glowBoxShadow;
        }
    }

    if (corners === "hexagon") {
        container.backgroundColor = "transparent";
        container.borderWidth = 0;
        container.boxShadow = undefined;
        container.aspectRatio = hexagonGeometry['flat-top'].aspectRatio;
        container.width = controlSize.height * hexagonGeometry['flat-top'].aspectRatio;
        container.paddingHorizontal = 0;
        container.paddingVertical = 0;
    }

    const textColor =
        disabled
            ? appearance.glyphs
            : highlightGlyphsShade !== undefined && isInteractiveState
              ? theme.color(highlightColor, highlightGlyphsShade)
               : glyphsShade !== undefined && !isInteractiveState
                ? theme.color(color, glyphsShade)
                : appearance.glyphs;
    const fontSize = controlSize.fontSize;

    const textShadowStyle = showTextGlow
        ? {
              textShadowColor: appearance.effects.glowColor,
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
          }
        : undefined;

    const iconSize = controlSize.iconSize;

    const iconElement = icon ? (
        <View
            style={
                iconRotateZ || iconRotateX
                    ? {
                          transform: [
                              { rotateZ: `${iconRotateZ}deg` },
                              { rotateX: `${iconRotateX}deg` },
                          ],
                      }
                    : undefined
            }
        >
            <Icon
                icon={icon}
                width={iconSize}
                height={iconSize}
                color={textColor}
                filter={
                    showTextGlow
                        ? `drop-shadow(0px 0px 12px ${appearance.effects.glowColor})`
                        : undefined
                }
            />
        </View>
    ) : null;

    const label = children ?? title;
    const labelChildren = Children.toArray(label);
    const textElement =
        labelChildren.length > 0 ? (
            <Text
                fontType={fontType}
                fontWeight={appearance.fontWeight}
                color={color}
                shadow={variant === 'fill-translucent' && !disabled}
                style={[
                    { color: textColor, fontSize, lineHeight: fontSize * 1.1 },
                    textShadowStyle,
                ]}
            >
                {labelChildren}
            </Text>
        ) : null;

    const content = (
        <>
            {iconElement}
            {textElement}
        </>
    );

    const buttonElement = (
        <Pressable
            ref={forwardRef}
            {...props}
            {...interaction}
            disabled={disabled}
            accessibilityRole={accessibilityRole ?? "button"}
            accessibilityLabel={accessibilityLabel ?? (!label && typeof tooltip === 'string' ? tooltip : undefined)}
            accessibilityState={{
                ...accessibilityState,
                disabled,
                selected: highlighted || accessibilityState?.selected,
            }}
            onPress={onPress ?? undefined}
            onLongPress={onLongPress ?? undefined}
            style={(state) => [
                styles.container,
                container,
                typeof style === "function" ? style(state) : style,
            ]}
        >
            {corners === "hexagon" ? (
                <HexagonSurface
                    shape="flat-top"
                    appearance={appearance}
                    showGlow={showGlow}
                >
                    {content}
                </HexagonSurface>
            ) : (
                content
            )}
        </Pressable>
    );

    if (
        tooltip !== null &&
        tooltip !== undefined &&
        tooltip !== false &&
        tooltip !== ""
    ) {
        return (
            <Tooltip
                placement={tooltipPlacement}
                content={tooltip}
                color={highlightColor || color}
                variant={
                    variant === "fill"
                        ? "fill"
                        : variant === "fill-translucent"
                          ? "fill-translucent"
                          : "fill-inverse"
                }
                showConnection={showTooltipConnection}
            >
                {buttonElement}
            </Tooltip>
        );
    }

    return buttonElement;
};
