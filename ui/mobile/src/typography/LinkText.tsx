import { FC } from "react";
import { Linking, Pressable } from "react-native";
import { Text, TextProps } from "./Text";

export interface LinkTextProps extends Omit<TextProps, 'onPress'> {
    href: string;
}

export const LinkText: FC<LinkTextProps> = ({
    href,
    children,
    color = 'primary',
    disabled,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    ...props
}) => (
    <Pressable
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ ...accessibilityState, disabled }}
        disabled={disabled}
        onPress={() => void Linking.openURL(href).catch(() => undefined)}
    >
        <Text {...props} color={color} disabled={disabled} style={[{ textDecorationLine: 'underline' }, style]}>
            {children}
        </Text>
    </Pressable>
);
