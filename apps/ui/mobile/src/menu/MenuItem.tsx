import { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../typography';
import { MenuItemProps, useMenuClose } from '@ui';

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
    onPress,
    children,
}) => {
    const handleClose = useMenuClose();

    return (
        <TouchableOpacity style={styles.menuItem} onPress={() => {
            onPress();
            handleClose();
        }}>
            <Text style={styles.menuText}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};
