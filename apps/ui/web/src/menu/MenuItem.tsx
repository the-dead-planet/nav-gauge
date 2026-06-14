import { FC } from 'react';
import { MenuItemProps, useMenuClose } from '@ui';
import styles from './menu.module.css';

export const MenuItem: FC<MenuItemProps> = ({
    label,
    onPress,
    closeOnPress,
}) => {
    const handleClose = useMenuClose();

    return (
        <button
            className={styles.menuItem}
            onClick={() => {
                onPress();
                if (closeOnPress) {
                    handleClose();
                }
            }}
        >
            {label}
        </button>
    );
};
