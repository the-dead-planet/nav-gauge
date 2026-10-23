import { FC } from "react";
import { Linking, Pressable, StyleSheet } from "react-native";
import { useTheme } from '@ui';
import { Text, TextProps } from "./Text";
import { useLinkInteraction } from './useLinkInteraction';

const styles = StyleSheet.create({
    link: {
        textDecorationLine: 'underline',
    },
    focused: {
        outlineStyle: 'solid',
        outlineWidth: 2,
        outlineOffset: 2,
    },
});

export interface LinkTextProps extends Omit<TextProps, 'onPress' | 'appearanceState'> {
    href: string;
}

export const LinkText: FC<LinkTextProps> = ({
    href,
    children,
    color = 'neutral',
    highlightColor = color,
    disabled,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    ...props
}) => {
    const { focused, interacting, ...interactionHandlers } = useLinkInteraction();
    const theme = useTheme();

    return (
        <Pressable
            {...interactionHandlers}
            style={focused && !disabled ? [
                styles.focused,
                {
                    outlineColor: theme.color(highlightColor),
                },
            ] : undefined}
            accessibilityRole="link"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{
                ...accessibilityState,
                disabled,
            }}
            disabled={disabled}
            onPress={() => void Linking.openURL(href).catch(() => undefined)}
        >
            {({ pressed }) => (
                <Text
                    {...props}
                    color={color}
                    highlightColor={highlightColor}
                    appearanceState={pressed ? 'active' : interacting ? 'interaction' : props.active ? 'active' : 'default'}
                    disabled={disabled}
                    style={[styles.link, style]}
                >
                    {children}
                </Text>
            )}
        </Pressable>
    );
};
