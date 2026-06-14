import { ComponentProps, FC } from 'react';
import classNames from 'classnames';
import { MenuItemProps, useMenuClose } from '@ui';
import styles from './menu.module.css';

interface ButtonProps extends ComponentProps<'button'> {
    type: 'button';
}

interface AnchorProps extends ComponentProps<'a'> {
    type: 'link';
}

type Props = ButtonProps | AnchorProps;

export const MenuItem: FC<MenuItemProps & Props> = ({
    closeOnPress,
    className,
    children,
    ...props
}) => {
    const handleClose = useMenuClose();

    if (props.type === 'link') {
        return (
            <a
                className={classNames(styles['menu-item'], className)}
                {...props}
                onClick={(e) => {
                    props.onClick?.(e);
                    if (closeOnPress) {
                        handleClose();
                    }
                }}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            className={classNames(styles['menu-item'], className)}
            {...props}
            onClick={(e) => {
                props.onClick?.(e);
                if (closeOnPress) {
                    handleClose();
                }
            }}
        >
            {children}
        </button>
    );
};
