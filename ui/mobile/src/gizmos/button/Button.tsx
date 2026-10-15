import { Children, ComponentType, FC, Ref, useState } from "react";
import {
    Pressable,
    PressableProps,
    View,
    type ViewInstance,
} from "react-native";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { SvgProps } from "react-native-svg";
import { Hexagon } from "../../hud";
import { Tooltip } from "../tooltip";
import { MutableViewStyle } from "../../model";
import { Text } from "../../design-system/typography";
import { TRANSLUCENT_OPACITY } from "../../tinkers";

export interface MobileButtonProps {
    forwardRef?: Ref<ViewInstance>;
    icon?: ComponentType<SvgProps>;
    title?: string;
}

export const Button: FC<PressableProps & ButtonProps & MobileButtonProps> = ({
    forwardRef,
    color = "neutral",
    contentShade,
    highlightColor = color,
    highlightContentShade,
    variant = "fill-inverse",
    activeGlow = "none",
    size = "sm",
    corners = "square",
    active = false,
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
    accessibilityRole,
    accessibilityState,
    ...props
}) => {
    const theme = useTheme();
    const [pressed, setPressed] = useState(false);
    const [glowDrawn, setGlowDrawn] = useState(false);

    const isActiveState = !disabled && (pressed || active);
    const isLight = theme.mode === "light";
    const shades = theme.variants[variant].shades;

    const activeInsetColor = theme.color(highlightColor, shades.active);
    const baseColor = theme.color(color, shades.base);
    const interactionShade = isActiveState ? shades.active : shades.base;
    const interactionColor = theme.color(highlightColor, interactionShade);

    const showGlow =
        !disabled && activeGlow !== "none" && (isActiveState || glowDrawn);

    const markGlowDrawn = () => {
        if (activeGlow !== "none") {
            setGlowDrawn(true);
        }
    };

    const isTextGlowVariant =
        variant === "ghost" || variant === "outline" || variant === "inset";
    const showTextGlow = showGlow && isTextGlowVariant;
    const controlSize = theme.sizes.control[size];

    const container: MutableViewStyle = {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        height: controlSize.height,
        paddingHorizontal: !children
            ? controlSize.iconPaddingInline
            : controlSize.paddingInline,
        paddingVertical: controlSize.paddingBlock,
        gap: controlSize.gap,
    };

    switch (variant) {
        case "ghost":
            container.backgroundColor = "transparent";
            container.borderWidth = 0;
            break;
        case "fill":
            container.borderWidth = 0;
            container.backgroundColor = isActiveState
                ? interactionColor
                : baseColor;
            break;
        case "fill-inverse":
            container.borderWidth = 1;
            container.backgroundColor = theme.color(
                color,
                shades.inverseSurface,
            );
            container.borderColor = isActiveState
                ? interactionColor
                : baseColor;
            break;
        case "fill-translucent":
            container.borderWidth = 1;
            container.backgroundColor = theme.color(
                color,
                shades.base,
                TRANSLUCENT_OPACITY,
            );
            container.borderColor = isActiveState
                ? interactionColor
                : theme.color(color, shades.base, 0.3);
            break;
        case "outline":
            container.borderWidth = 1;
            container.backgroundColor = isActiveState
                ? theme.color(highlightColor, shades.base, 0.16)
                : "transparent";
            container.borderColor = isActiveState
                ? interactionColor
                : baseColor;
            break;
        case "inset":
            container.backgroundColor = theme.color(color, shades.insetSurface);
            container.borderWidth = 0;
            container.borderTopWidth = 1;
            container.borderLeftWidth = 1;
            container.borderBottomWidth = 1;
            container.borderRightWidth = 1;
            if (isLight) {
                const insetColor = isActiveState ? highlightColor : color;
                container.borderTopColor = theme.color(
                    insetColor,
                    shades.content,
                    0.2,
                );
                container.borderLeftColor = theme.color(
                    insetColor,
                    shades.content,
                    0.2,
                );
                container.borderBottomColor = theme.color(
                    insetColor,
                    shades.brightest,
                    0.7,
                );
                container.borderRightColor = theme.color(
                    insetColor,
                    shades.brightest,
                    0.7,
                );
                container.boxShadow = `3px 3px 4px ${theme.color(insetColor, shades.content, 0.2)} inset, 4px 4px 8px ${theme.color(insetColor, shades.shadow, 0.18)} inset, -2px -2px 3px rgba(255, 255, 255, .7) inset`;
            } else {
                container.borderTopColor = "rgba(0,0,0,0.80)";
                container.borderLeftColor = "rgba(0,0,0,0.80)";
                container.borderBottomColor = "rgba(255,255,255,0.08)";
                container.borderRightColor = "rgba(255,255,255,0.08)";
                container.boxShadow =
                    "4px 4px 8px rgba(0,0,0,0.80) inset, -2px -2px 4px rgba(255,255,255,0.08) inset";
            }
            break;
    }

    if (corners === "circle") {
        container.borderRadius = (container.height as number) / 2;
        container.width = container.height;
        container.paddingHorizontal = 0;
    }

    if (showGlow && corners !== "hexagon") {
        const glowBoxShadow = `0px 0px 4px ${theme.color(highlightColor, shades.base, 0.3)}, 0px 0px 20px ${theme.color(highlightColor, shades.base, 0.6)}`;
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
    }

    const fillTextColor = theme.color(color, theme.contrastShade(color));
    const hlFillTextColor = theme.color(
        highlightColor,
        theme.contrastShade(highlightColor, interactionShade),
    );
    let textColor =
        highlightContentShade !== undefined && isActiveState
            ? theme.color(highlightColor, highlightContentShade)
            : contentShade !== undefined && !isActiveState
              ? theme.color(color, contentShade)
              : variant === "fill"
                ? isActiveState
                    ? hlFillTextColor
                    : fillTextColor
                : variant === "fill-inverse"
                  ? theme.color(
                        isActiveState ? highlightColor : color,
                        shades.content,
                    )
                  : isActiveState
                    ? interactionColor
                    : baseColor;
    if (disabled) {
        const disabledColor = theme.color(color, shades.disabledContent);
        container.backgroundColor = theme.color(
            color,
            shades.disabledSurface,
            variant === "fill-translucent" ? TRANSLUCENT_OPACITY : undefined,
        );
        if (variant === "ghost" || variant === "outline") {
            container.backgroundColor = "transparent";
        }
        if (variant === "inset") {
            container.backgroundColor = theme.color(color, shades.insetSurface);
            container.borderColor = disabledColor;
        } else if (variant === "fill") {
            container.borderWidth = 0;
        } else {
            container.borderColor = disabledColor;
        }
        textColor = disabledColor;
    }
    const fontSize = controlSize.fontSize;

    const showTextShadow =
        showTextGlow ||
        (isActiveState && (variant === "inset" || variant === "ghost"));

    const textShadowStyle = showTextShadow
        ? {
              textShadowColor: activeInsetColor,
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
          }
        : variant === "fill-translucent"
          ? {
                textShadowColor: theme.color(color, shades.shadow, 0.5),
                textShadowOffset: { width: -1, height: 0 },
                textShadowRadius: 1,
            }
          : undefined;

    const iconSize = controlSize.iconSize;

    const iconElement = icon ? (
        <View
            style={
                iconRotateZ
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
                    showTextShadow
                        ? `drop-shadow(0px 0px 12px ${activeInsetColor})`
                        : undefined
                }
            />
        </View>
    ) : null;

    const label = children ?? title;
    const labelChildren = Children.toArray(label);
    const textElement =
        labelChildren.length > 0 &&
        labelChildren.every(
            (child) => typeof child === "string" || typeof child === "number",
        ) ? (
            <Text
                style={[
                    { color: textColor, fontSize, lineHeight: fontSize * 1.1 },
                    textShadowStyle,
                ]}
            >
                {labelChildren}
            </Text>
        ) : (
            (label ?? null)
        );

    const content = (
        <>
            {iconElement}
            {textElement}
        </>
    );

    const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (event) => {
        if (!disabled) {
            setPressed(true);
            markGlowDrawn();
        }
        onPressIn?.(event);
    };

    const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (
        event,
    ) => {
        setPressed(false);
        setGlowDrawn(false);
        onPressOut?.(event);
    };

    const buttonElement = (
        <Pressable
            ref={forwardRef}
            {...props}
            disabled={disabled}
            accessibilityRole={accessibilityRole ?? "button"}
            accessibilityState={{
                ...accessibilityState,
                disabled,
                selected: active || accessibilityState?.selected,
            }}
            onPress={onPress ?? undefined}
            onLongPress={onLongPress ?? undefined}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={(state) => [
                corners === "hexagon" ? undefined : container,
                typeof style === "function" ? style(state) : style,
            ]}
        >
            {corners === "hexagon" ? (
                <Hexagon
                    shape="flat-top"
                    size={size}
                    variant={variant}
                    activeGlow={activeGlow}
                    color={color}
                    highlightColor={highlightColor}
                    active={isActiveState}
                    disabled={disabled}
                >
                    {content}
                </Hexagon>
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
