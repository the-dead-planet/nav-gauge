import { FC } from "react";
import { Linking, Pressable } from "react-native";
import { Text, TextProps } from "./Text";

export interface LinkTextProps extends Omit<TextProps, 'onPress'> {
    href: string;
}

export const LinkText: FC<LinkTextProps> = ({ href, children, color = 'primary', disabled, style, ...props }) => (
    <Pressable
        accessibilityRole="link"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => Linking.openURL(href)}
    >
        <Text {...props} color={color} disabled={disabled} style={[{ textDecorationLine: 'underline' }, style]}>
            {children}
        </Text>
    </Pressable>
);
