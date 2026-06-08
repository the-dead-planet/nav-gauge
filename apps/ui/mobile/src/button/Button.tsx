import { ComponentType, FC, useCallback, useState } from "react";
import { Pressable, PressableProps, Text as RNText, ViewStyle } from "react-native";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../icons";
import { SvgProps } from "react-native-svg";
import { Hexagon } from "../hud";

export const Button: FC<PressableProps & ButtonProps & { icon?: ComponentType<SvgProps>; title?: string }> = ({
    color = 'neutral',
    highlightColor: hlColor,
    variant = 'ghost',
    glowStyle = 'none',
    size = 'sm',
    corners = 'square',
    active = false,
    themeMode,
    title,
    icon,
    children,
    style,
    disabled,
    ...props
}) => {
    const theme = useTheme();
    const highlightColor = hlColor ?? color;
    const [pressed, setPressed] = useState(false);
    const [glowDrawn, setGlowDrawn] = useState(false);
    const hl = pressed || active;
    const isLight = (themeMode || theme.mode) === 'light';

    const hlInset = theme.color(highlightColor, isLight ? 600 : 300);
    const baseColor = theme.color(color);
    const hl500 = theme.color(highlightColor, 500);

    const showGlow = glowStyle !== 'none' && (hl || glowDrawn);

    const markGlowDrawn = useCallback(() => {
        if (glowStyle !== 'none') {
            setGlowDrawn(true);
        }
    }, [glowStyle]);

    const isTextGlowVariant = variant === 'ghost' || variant === 'outline' || variant === 'inset';
    const showTextGlow = showGlow && isTextGlowVariant;

    const container: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    };

    switch (size) {
        case 'md':
            container.height = 32;
            container.paddingHorizontal = !children ? 5 : 16;
            container.paddingVertical = 6;
            container.gap = 10;
            break;
        case 'sm':
            container.height = 24;
            container.paddingHorizontal = !children ? 3 : 16;
            container.paddingVertical = 2;
            container.gap = 6;
            break;
        case 'xs':
            container.height = 18;
            container.paddingHorizontal = !children ? 2 : 16;
            container.paddingVertical = 0;
            container.gap = 4;
            break;
    }

    const effectiveVariant = variant;

    switch (effectiveVariant) {
        case 'ghost':
            container.backgroundColor = 'transparent';
            container.borderWidth = 0;
            break;
        case 'fill':
            container.borderWidth = 0;
            if (active) {
                container.backgroundColor = theme.color(highlightColor, 500);
            } else if (pressed) {
                container.backgroundColor = theme.color(highlightColor, 300);
            } else {
                container.backgroundColor = theme.color(color, 500);
            }
            break;
        case 'fill-inverse':
            container.borderWidth = 1;
            if (active) {
                container.backgroundColor = theme.color(highlightColor, isLight ? 100 : (highlightColor === 'neutral' ? 800 : 900));
                container.borderColor = hl500;
            } else if (pressed) {
                container.backgroundColor = theme.color(highlightColor, isLight ? 100 : (highlightColor === 'neutral' ? 800 : 900));
                container.borderColor = theme.color(highlightColor, isLight ? 600 : 300);
            } else {
                container.backgroundColor = theme.color(color, isLight ? 100 : (color === 'neutral' ? 800 : 900));
                container.borderColor = baseColor;
            }
            break;
        case 'fill-translucent':
            container.borderWidth = 1;
            if (active) {
                container.backgroundColor = theme.color(highlightColor, 500, 0.48);
                container.borderColor = hl500;
            } else if (pressed) {
                container.backgroundColor = theme.color(highlightColor, 500, 0.36);
                container.borderColor = theme.color(highlightColor, isLight ? 600 : 300);
            } else {
                container.backgroundColor = theme.color(color, 500, 0.24);
                container.borderColor = theme.color(color, 500, 0.3);
            }
            break;
        case 'outline':
            container.borderWidth = 1;
            if (hl) {
                container.backgroundColor = theme.color(highlightColor, 500, 0.24);
                container.borderColor = hlInset;
            } else {
                container.backgroundColor = 'transparent';
                container.borderColor = baseColor;
            }
            break;
        case 'inset':
            container.backgroundColor = isLight
                ? theme.color(color, 500, 0.04)
                : 'transparent';
            container.borderWidth = 0;
            container.borderTopWidth = 1;
            container.borderLeftWidth = 1;
            container.borderBottomWidth = 1;
            container.borderRightWidth = 1;
            if (isLight) {
                container.borderTopColor = theme.color(color, 700, 0.18);
                container.borderLeftColor = theme.color(color, 700, 0.18);
                container.borderBottomColor = 'rgba(255,255,255,0.35)';
                container.borderRightColor = 'rgba(255,255,255,0.35)';
                container.boxShadow = active || pressed
                    ? `4px 4px 8px ${theme.color(color, 700, 0.18)} inset, -2px -2px 4px ${theme.color(color, 700, 0.04)} inset, -2px -2px 3px rgba(255, 255, 255, .25) inset`
                    : `4px 4px 8px ${theme.color(color, 700, 0.18)} inset, -2px -2px 4px ${theme.color(color, 700, 0.04)} inset, -2px -2px 4px rgba(255, 255, 255, .35) inset`;
            } else {
                container.borderTopColor = 'rgba(0,0,0,0.80)';
                container.borderLeftColor = 'rgba(0,0,0,0.80)';
                container.borderBottomColor = 'rgba(255,255,255,0.08)';
                container.borderRightColor = 'rgba(255,255,255,0.08)';
                container.boxShadow = active || pressed
                    ? `4px 4px 8px rgba(0,0,0,0.80) inset, -2px -2px 4px rgba(0, 0, 0, .24) inset`
                    : `4px 4px 8px rgba(0,0,0,0.80) inset, -2px -2px 4px rgba(255,255,255,0.08) inset`;
            }
            break;
    }

    if (showGlow && corners !== 'hexagon') {
        const glowBoxShadow = `0px 0px 4px ${theme.color(highlightColor, 500, 0.3)}, 0px 0px 20px ${theme.color(highlightColor, 500, 0.6)}`;
        if (container.boxShadow) {
            container.boxShadow = `${container.boxShadow}, ${glowBoxShadow}`;
        } else {
            container.boxShadow = glowBoxShadow;
        }
    }

    if (corners === 'hexagon') {
        container.backgroundColor = 'transparent';
        container.borderWidth = 0;
        container.boxShadow = undefined;
    }

    const fillTextColor = color === 'neutral'
        ? theme.color('neutral', 800)
        : theme.color(color, 900);
    const hlFillTextColor = highlightColor === 'neutral'
        ? theme.color('neutral', 800)
        : theme.color(highlightColor, 900);
    const textColor = effectiveVariant === 'fill'
        ? (hl ? hlFillTextColor : fillTextColor)
        : (hl ? hlInset : baseColor);
    let fontSize = 14;
    if (size === 'xs') fontSize = 12;

    const showTextShadow = showTextGlow || (hl && (variant === 'inset' || variant === 'ghost'));

    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
    }

    const iconSize = iconSizes[size];

    const iconElement = icon ? (
        <Icon
            icon={icon}
            width={iconSize}
            height={iconSize}
            color={theme.color(
                pressed || active ? highlightColor : color,
                effectiveVariant === 'fill'
                    ? ((pressed || active ? highlightColor : color) === 'neutral' && isLight ? 700 : 900)
                    : (pressed || active ? (theme.mode === 'dark' ? 300 : 600) : 500)
            )}
            filter={showTextShadow ? `drop-shadow(0px 0px 12px ${hlInset})` : undefined}
        />
    ) : null;

    const textElement = children || title ? (
        <RNText
            style={[
                { color: textColor, fontSize, lineHeight: fontSize * 1.1 },
                showTextShadow && {
                    textShadowColor: hlInset,
                    textShadowRadius: 12,
                    textShadowOffset: { width: 0, height: 0 },
                },
            ]}
        >
            {children ?? title}
        </RNText>
    ) : null;

    const content = (
        <>
            {iconElement}
            {textElement}
        </>
    );

    if (corners === 'hexagon') {
        const { onPress, onLongPress, ...rest } = props;
        return (
            <Hexagon
                size={size}
                variant={variant}
                glowStyle={glowStyle}
                themeMode={themeMode}
                color={color}
                highlightColor={hlColor || color}
                active={active}
                interactive={!disabled}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={() => {
                    setPressed(true);
                    markGlowDrawn();
                    rest.onPressIn?.();
                }}
                onPressOut={() => {
                    setPressed(false);
                    rest.onPressOut?.();
                }}
                style={typeof style === 'function' ? undefined : style}
            >
                {content}
            </Hexagon>
        );
    }

    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => {
                setPressed(true);
                markGlowDrawn();
            }}
            onPressOut={() => setPressed(false)}
            style={[container, style as ViewStyle]}
            {...props}
        >
            {content}
        </Pressable>
    );
};
