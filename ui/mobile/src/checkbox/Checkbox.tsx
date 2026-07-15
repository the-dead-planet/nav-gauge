import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { CheckboxProps, useTheme } from "@ui";
import { Text } from "../typography";

export const Checkbox: FC<CheckboxProps> = ({
    color = 'primary',
    highlightColor = color,
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
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;
    const borderRadius = size === 'md' ? 3 : 2;

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.4 : 1,
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {({ pressed }) => {
                const boxColor = pressed ? accentColor : baseColor;

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
                                <Text
                                    style={{
                                        color: theme.color(highlightColor, 100),
                                        fontSize: boxWidthHeight * 0.7,
                                        lineHeight: boxWidthHeight,
                                    }}
                                >
                                    {'\u2713'}
                                </Text>
                            ) : null}
                        </View>
                        {children ? (
                            <Text
                                style={{
                                    color: baseColor,
                                    fontSize,
                                    lineHeight: fontSize * 1.1,
                                }}
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
