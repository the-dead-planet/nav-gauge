import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { controlTextSpecifications, RadioProps, useTheme } from "@ui";
import { Text } from "../../typography";

export const Radio: FC<RadioProps> = ({
    color = 'primary',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    variant = 'fill',
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    active = false,
    children,
}) => {
    const theme = useTheme();

    const accentColor = theme.isLight
        ? theme.color(highlightColor, 600)
        : theme.color(highlightColor, 300);
    const baseColor = theme.color(color);

    const boxWidthHeight = size === 'md' ? 16 : size === 'sm' ? 14 : 12;
    const dotSize = boxWidthHeight / 2;
    const textStyle = controlTextSpecifications[size];

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    };

    return (
        <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked, disabled }}
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {({ pressed }) => {
                const highlighted = !disabled && (active || pressed);
                const activeColor = highlighted ? highlightColor : color;
                const boxColor = checked && variant === 'fill-inverse'
                    ? theme.color(activeColor, theme.isLight ? 100 : (activeColor === 'neutral' ? 800 : 900))
                    : disabled ? theme.color(color, theme.isLight ? 300 : 700) : highlighted ? accentColor : baseColor;
                const dotColor = variant === 'fill-inverse'
                    ? theme.color(activeColor, theme.isLight ? (activeColor === 'neutral' ? 800 : 900) : 100)
                    : variant === 'fill-translucent' ? boxColor
                    : theme.color(activeColor, theme.isDark ? 900 : 100);
                const backgroundColor = disabled
                    ? theme.color(color, theme.isLight ? 200 : 800)
                    : checked
                    ? variant === 'fill-translucent'
                        ? theme.color(activeColor, pressed ? (theme.isLight ? 600 : 300) : 500, 0.24)
                        : boxColor
                    : 'transparent';

                const boxStyle: ViewStyle = {
                    width: boxWidthHeight,
                    height: boxWidthHeight,
                    borderRadius: boxWidthHeight / 2,
                    borderWidth: 1,
                    borderColor: boxColor,
                    backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                };

                return (
                    <>
                        <View style={boxStyle}>
                            {checked ? (
                                <View
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: dotSize / 2,
                                        backgroundColor: dotColor,
                                    }}
                                />
                            ) : null}
                        </View>
                        {children ? (
                            <Text
                                color={highlighted ? highlightColor : color}
                                shade={disabled ? (theme.isLight ? 300 : 700) : highlighted ? highlightContentShade : contentShade}
                                style={textStyle}
                            >
                                {children}
                            </Text>
                        ) : null}
                    </>
                );
            }}
        </Pressable>
    );
};
