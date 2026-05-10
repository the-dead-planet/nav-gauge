import { FC } from "react";
import { Linking, Pressable, TextProps } from "react-native";
import { useTheme } from "@ui";
import { Text } from "./Text";

export interface LinkTextProps extends TextProps {
    href: string
}

export const LinkText: FC<LinkTextProps> = ({ href, children, ...props }) => {
    const theme = useTheme();

    return (
        <Pressable
            onPressOut={() => Linking.openURL(href)}
            style={({ pressed }) => ({
                borderBottomWidth: 1,
                borderBottomColor: pressed ? theme.componentColor('text') : 'transparent'
            })}
        >
            <Text {...props}>
                {children}
            </Text>
        </Pressable>
    );
};
