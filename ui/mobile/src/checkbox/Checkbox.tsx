import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { CheckboxProps, useTheme } from "@ui";
import { Text } from "../typography";

export const Checkbox: FC<CheckboxProps> = ({
    color = 'primary',
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    children,
}) => {
    const theme = useTheme();

    const baseColor = theme.color(color);
    const darkColor = theme.color(color, 900);

    const boxWidthHeight = size === 'md' ? 18 : size === 'sm' ? 16 : 14;
    const fontSize = size === 'xs' ? 12 : 14;
    const borderRadius = size === 'md' ? 4 : size === 'sm' ? 3 : 2;

    const boxStyle: ViewStyle = {
        width: boxWidthHeight,
        height: boxWidthHeight,
        borderRadius,
        borderWidth: 1,
        borderColor: checked ? baseColor : baseColor,
        backgroundColor: checked ? baseColor : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    };

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
            <View style={boxStyle}>
                {checked ? (
                    <Text
                        style={{
                            color: darkColor,
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
        </Pressable>
    );
};
