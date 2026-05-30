import { ComponentType, FC, useState } from "react";
import { Pressable, PressableProps, Text as RNText, ViewStyle } from "react-native";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../icons";
import { SvgProps } from "react-native-svg";

export const Button: FC<PressableProps & ButtonProps & { icon?: ComponentType<SvgProps>; title?: string }> = ({
    color = 'neutral',
    highlightColor: hlColor,
    variant = 'ghost',
    size = 'sm',
    corners = 'square',
    active = false,
    mode,
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
    const hl = pressed || active;

    const isLight = (mode || theme.mode) === 'light';

    const hlInset = theme.color(highlightColor, isLight ? 600 : 300);
    const baseColor = theme.color(color);

    const container: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    };

    switch (size) {
        case 'md':
            container.height = 32;
            container.paddingHorizontal = 16;
            container.paddingVertical = 6;
            container.gap = 10;
            break;
        case 'sm':
            container.height = 24;
            container.paddingHorizontal = 16;
            container.paddingVertical = 2;
            container.gap = 6;
            break;
        case 'xs':
            container.height = 18;
            container.paddingHorizontal = 16;
            container.paddingVertical = 0;
            container.gap = 4;
            break;
    }

    switch (variant) {
        case 'ghost':
            container.backgroundColor = 'transparent';
            container.borderWidth = 0;
            break;
        case 'fill':
            container.borderWidth = 0;
            container.backgroundColor = hl
                ? theme.color(highlightColor, 500, active ? 0.48 : 0.36)
                : theme.color(color, 500, 0.24);
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

    const textColor = hl ? hlInset : baseColor;
    let fontSize = 14;
    if (size === 'xs') fontSize = 12;

    const showTextShadow = hl && (variant === 'inset' || variant === 'ghost');

    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
    }

    const iconSize = iconSizes[size];

    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[container, style as ViewStyle]}
            {...props}
        >
            {icon ? (
                <Icon
                    icon={icon}
                    width={iconSize}
                    height={iconSize}
                    color={theme.color(
                        pressed || active ? highlightColor || color : color,
                        pressed || active ? (theme.mode === 'dark' ? 300 : 600) : 500
                    )}
                    filter={showTextShadow ? `drop-shadow(0px 0px 6px ${hlInset})` : undefined}
                />
            ) : null}
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
        </Pressable>
    );
};
