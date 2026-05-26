import { useMenuClose } from '@ui';
import styles from './menu.module.css';

export interface MenuItemProps {
    label: string;
    onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    label,
    onPress,
}) => {
    const handleClose = useMenuClose();

    return (
        <button
            className={styles.menuItem}
            onClick={() => { onPress(); handleClose(); }}
        >
            {label}
        </button>
    );
};
