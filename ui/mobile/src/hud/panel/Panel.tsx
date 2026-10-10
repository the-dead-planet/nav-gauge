import { FC, useState } from "react";
import { View, ViewStyle, StyleProp, Pressable } from "react-native";
import { PanelProps, useTheme } from "@ui";
import { TRANSLUCENT_OPACITY_BACKGROUND } from "../../tinkers";

interface Props {
    style?: StyleProp<ViewStyle>;
}

export const Panel: FC<PanelProps & Props> = ({
    color = "neutral",
    highlightColor = color,
    variant,
    glowStyle: _glowStyle,
    borderWidth = 2,
    interactive = false,
    active = false,
    disabled = false,
    style,
    children,
}) => {
    const theme = useTheme();
    const [pressed, setPressed] = useState(false);
    const hl = !disabled && (pressed || active);
    const isLight = theme.mode === 'light';

    const baseColor = theme.color(color, 500);
    const highlight500 = theme.color(highlightColor, 500);
    const highlightAccent = theme.color(highlightColor, isLight ? 600 : 300);

    const containerStyle: ViewStyle = (() => {
        if (disabled) {
            const foregroundColor = theme.color(color, isLight ? 300 : 700);
            return {
                backgroundColor: theme.color(color, isLight ? 200 : 800),
                borderColor: foregroundColor,
                borderWidth: variant === 'fill' ? 0 : borderWidth,
            };
        }

        switch (variant) {
            case 'fill': {
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = highlightAccent;
                    borderColor = highlightAccent;
                } else if (pressed) {
                    fillColor = highlightAccent;
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, 500);
                    borderColor = baseColor;
                }
                return {
                    backgroundColor: fillColor,
                    borderColor: borderColor,
                    borderWidth,
                };
            }

            case 'fill-inverse': {
                const isNeutral = color === 'neutral';
                const bgShade = isLight ? 100 : (isNeutral ? 800 : 900);
                const hlBgShade = isLight ? 100 : 900;
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = theme.color(color, bgShade);
                    borderColor = highlightAccent;
                } else if (pressed) {
                    fillColor = theme.color(highlightColor, hlBgShade);
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, bgShade);
                    borderColor = baseColor;
                }
                return {
                    backgroundColor: fillColor,
                    borderColor: borderColor,
                    borderWidth,
                };
            }

            case 'fill-translucent': {
                const fill = hl
                    ? theme.color(highlightColor, active ? (isLight ? 600 : 300) : 500, active ? 0.48 : 0.36)
                    : theme.color(color, 500, TRANSLUCENT_OPACITY_BACKGROUND);
                const border = hl ? highlightAccent : baseColor;
                return {
                    backgroundColor: fill,
                    borderColor: border,
                    borderWidth,
                };
            }

            default: {
                const isOutline = variant === 'outline';
                const isGhost = variant === 'ghost';
                let bgFill: string | undefined;
                let bColor: string;
                if (active) {
                    bgFill = theme.color(highlightColor, isLight ? 600 : 300, isOutline ? 0.24 : 0.14);
                    bColor = isOutline ? highlightAccent : 'transparent';
                } else if (pressed) {
                    bgFill = theme.color(highlightColor, 500, isOutline ? 0.12 : 0.10);
                    bColor = isOutline ? highlightAccent : 'transparent';
                } else {
                    bgFill = isGhost ? 'transparent' : undefined;
                    bColor = isOutline ? baseColor : 'transparent';
                }
                return {
                    backgroundColor: bgFill,
                    borderColor: bColor,
                    borderWidth: isOutline ? borderWidth : 0,
                };
            }
        }
    })();

    const container = (
        <View style={[containerStyle, style]}>
            {children}
        </View>
    );

    if (interactive) {
        return (
            <Pressable
                disabled={disabled}
                accessibilityState={{ disabled }}
                onPress={() => { /* external click handling via parent */ }}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
            >
                {container}
            </Pressable>
        );
    }

    return container;
};
