import { FC, useState } from "react";
import { Pressable, PressableProps, Text as RNText, ViewStyle } from "react-native";
import { ButtonProps, useTheme } from "@ui";

export const Button: FC<PressableProps & ButtonProps & { title?: string }> = ({
    color = 'neutral',
    highlightColor: hlColor,
    variant = 'ghost',
    size = 'sm',
    corners = 'square',
    active = false,
    mode,
    title,
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
        alignItems: 'center',
        justifyContent: 'center',
    };

    switch (size) {
        case 'md':
            container.height = 32;
            container.paddingHorizontal = 16;
            container.paddingVertical = 6;
            break;
        case 'sm':
            container.height = 24;
            container.paddingHorizontal = 16;
            container.paddingVertical = 2;
            break;
        case 'xs':
            container.height = 18;
            container.paddingHorizontal = 16;
            container.paddingVertical = 0;
            break;
    }

    switch (corners) {
        case 'rounded':
            container.borderRadius = size === 'md' ? 6 : 4;
            break;
        case 'circle':
            if (size === 'md') container.borderRadius = 16;
            else if (size === 'sm') container.borderRadius = 12;
            else container.borderRadius = 10;
            break;
        default:
            container.borderRadius = 0;
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
                container.borderBottomColor = theme.color(color, 700, 0.04);
                container.borderRightColor = theme.color(color, 700, 0.04);
            } else {
                container.borderTopColor = `rgba(0,0,0,0.80)`;
                container.borderLeftColor = `rgba(0,0,0,0.80)`;
                container.borderBottomColor = `rgba(0,0,0,0.24)`;
                container.borderRightColor = `rgba(0,0,0,0.24)`;
            }
            break;
    }

    const textColor = hl ? hlInset : baseColor;
    let fontSize = 14;
    if (size === 'xs') fontSize = 12;

    const showTextShadow = hl && (variant === 'inset' || variant === 'ghost');

    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[container, style as ViewStyle]}
            {...props}
        >
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
