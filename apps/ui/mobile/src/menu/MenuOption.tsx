import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../text';
import { useMenuClose } from './Menu';

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
    },
});

export interface MenuOptionsProps {
    label: string;
    onPress: () => void;
}

export const MenuOption: React.FC<MenuOptionsProps> = ({
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
