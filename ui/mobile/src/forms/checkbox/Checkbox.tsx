import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CheckboxProps, controlTextSpecifications, useTheme } from "@ui";
import { Text } from "../../typography";

export const Checkbox: FC<CheckboxProps> = ({
    color = 'neutral',
    highlightColor = color,
    variant = 'fill',
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    children,
}) => {
    const theme = useTheme();

    const accentColor = theme.isLight
        ? theme.color(highlightColor, 600)
        : theme.color(highlightColor, 300);
    const baseColor = theme.color(color);

    const boxWidthHeight = size === 'md' ? 16 : size === 'sm' ? 14 : 12;
    const textStyle = controlTextSpecifications[size];
    const borderRadius = size === 'md' ? 3 : 2;

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.4 : 1,
    };

    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {({ pressed }) => {
                const activeColor = pressed ? highlightColor : color;
                const boxColor = checked && variant === 'fill-inverse'
                    ? theme.color(activeColor, theme.isLight ? 100 : (activeColor === 'neutral' ? 800 : 900))
                    : pressed ? accentColor : baseColor;
                const checkmarkColor = variant === 'fill-inverse'
                    ? theme.color(activeColor, theme.isLight ? (activeColor === 'neutral' ? 800 : 900) : 100)
                    : theme.color(activeColor, theme.isDark ? 900 : 100);

                const boxStyle: ViewStyle = {
                    width: boxWidthHeight,
                    height: boxWidthHeight,
                    borderRadius,
                    borderWidth: 1,
                    borderColor: boxColor,
                    backgroundColor: checked ? boxColor : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                };

                return (
                    <>
                        <View style={boxStyle}>
                            {checked ? (
                                <Svg width={boxWidthHeight * 0.7} height={boxWidthHeight * 0.7} viewBox="0 0 12 12">
                                    <Path
                                        d="M2 6l3 3 5-5"
                                        fill="none"
                                        stroke={checkmarkColor}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </Svg>
                            ) : null}
                        </View>
                        {children ? (
                            <Text color={color} style={textStyle}>
                                {children}
                            </Text>
                        ) : null}
                    </>
                );
            }}
        </Pressable>
    );
};
