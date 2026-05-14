import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../text';

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
}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
);
