import { FC, useState } from "react";
import { Pressable, PressableProps, Text as RNText, TextStyle, ViewStyle } from "react-native";
import { ButtonProps, useTheme } from "@ui";

export const Button: FC<PressableProps & ButtonProps & { title?: string }> = ({
    color = 'neutral',
    highlightColor: hlColor,
    variant = 'ghost',
    size = 'sm',
    corners = 'square',
    active = false,
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

    const bgShade = theme.mode === 'light' ? 500 : 300;
    const hlShade = theme.mode === 'light' ? 600 : 300;
    const hlStr = theme.color(highlightColor, hlShade);
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
            container.backgroundColor = theme.color(
                hl ? highlightColor : color,
                500,
                hl ? 0.48 : 0.24,
            );
            break;
        case 'outline':
            container.backgroundColor = hl
                ? theme.color(highlightColor, 500, 0.24)
                : 'transparent';
            container.borderWidth = 1;
            container.borderColor = hl ? hlStr : baseColor;
            break;
        case 'inset':
            container.borderWidth = 1;
            container.borderColor = theme.mode === 'light'
                ? theme.color(highlightColor, bgShade, 0.3)
                : 'transparent';
            container.backgroundColor = 'transparent';
            break;
    }

    const textColor = hl ? hlStr : baseColor;
    let fontSize = 14;
    if (size === 'xs') fontSize = 12;

    const textShadow: TextStyle | undefined = hl && (variant === 'inset' || variant === 'ghost')
        ? { textShadowColor: hlStr, textShadowRadius: 12, textShadowOffset: { width: 0, height: 0 } }
        : undefined;

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
                    textShadow,
                ]}
            >
                {children ?? title}
            </RNText>
        </Pressable>
    );
};
