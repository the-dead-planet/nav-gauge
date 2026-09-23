import { FC } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from '../typography';
import { MenuItemProps, useMenuContext, useTheme } from '@ui';

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
    },
});

export const MenuItem: FC<{ onPress: () => void; } & MenuItemProps> = ({
    highlightColor,
    onPress,
    disabled,
    children,
}) => {
    const theme = useTheme();
    const { color, onClose } = useMenuContext();
    const textColor = theme.color(color, theme.isLight ? 900 : 100);

    return (
        <TouchableHighlight
            underlayColor={theme.color(highlightColor ?? color, 500, 0.14)}
            style={styles.menuItem}
            onPress={() => {
                onPress();
                onClose();
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            <Text style={[styles.menuText, { color: textColor }]}>
                {children}
            </Text>
        </TouchableHighlight>
    );
};
