import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { CheckboxProps, useTheme } from "@ui";
import { Text } from "../typography";

export const Checkbox: FC<CheckboxProps> = ({
    color = 'primary',
    highlightColor: hlColor,
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    children,
}) => {
    const theme = useTheme();
    const highlightColor = hlColor || color;
    const isLight = theme.mode === 'light';

    const accentColor = isLight
        ? theme.color(highlightColor, 600)
        : theme.color(highlightColor, 300);
    const baseColor = theme.color(color);

    const boxWidthHeight = size === 'md' ? 18 : size === 'sm' ? 16 : 14;
    const fontSize = size === 'xs' ? 12 : 14;
    const borderRadius = size === 'md' ? 4 : size === 'sm' ? 3 : 2;

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
                                        color: theme.color(highlightColor, 900),
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
