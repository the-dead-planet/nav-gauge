import { useMenuClose } from '@ui';
import styles from './menu.module.css';
import { FC } from 'react';

export interface MenuItemProps {
    label: string;
    onPress: () => void;
}

export const MenuItem: FC<MenuItemProps> = ({
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
