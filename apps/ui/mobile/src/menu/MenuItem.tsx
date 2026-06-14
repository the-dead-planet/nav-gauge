import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../typography';
import { MenuItemProps, useMenuClose } from '@ui';
import { FC } from 'react';

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
    },
});

export const MenuItem: FC<MenuItemProps> = ({
    label,
    onPress,
}) => {
    const handleClose = useMenuClose();

    return (
        <TouchableOpacity style={styles.menuItem} onPress={() => { onPress(); handleClose(); }}>
            <Text style={styles.menuText}>{label}</Text>
        </TouchableOpacity>
    );
};
