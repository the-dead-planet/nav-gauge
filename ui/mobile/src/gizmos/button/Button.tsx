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
    variant = "ghost",
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
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        disabled ? "disabled" : isActiveState ? "active" : "default",
    );
    const showGlow =
        !disabled && activeGlow !== "none" && (isActiveState || glowDrawn);

    const markGlowDrawn = () => {
        if (activeGlow !== "none") {
            setGlowDrawn(true);
        }
    };

    const showTextGlow = showGlow && appearance.effects.glyphsGlow;
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
        backgroundColor: appearance.surface,
        borderColor: appearance.border.color,
        borderWidth: appearance.border.width,
    };

    if (appearance.effects.depth === "inset") {
        container.borderTopColor = appearance.effects.inset.edgeStart;
        container.borderLeftColor = appearance.effects.inset.edgeStart;
        container.borderBottomColor = appearance.effects.inset.edgeEnd;
        container.borderRightColor = appearance.effects.inset.edgeEnd;
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
    }

    const textColor =
        highlightContentShade !== undefined && isActiveState
            ? theme.color(highlightColor, highlightContentShade)
            : contentShade !== undefined && !isActiveState
              ? theme.color(color, contentShade)
              : appearance.glyphs;
    const fontSize = controlSize.fontSize;

    const showTextShadow =
        showTextGlow ||
        (isActiveState && appearance.effects.glyphsGlow);

    const textShadowStyle = showTextShadow
        ? {
              textShadowColor: appearance.effects.glowColor,
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
          }
        : appearance.effects.backdropBlur > 0
          ? {
                textShadowColor: appearance.border.color,
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
                        ? `drop-shadow(0px 0px 12px ${appearance.effects.glowColor})`
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
