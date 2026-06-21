import { ComponentProps, FC } from 'react';
import classNames from 'classnames';
import { MenuItemProps, useMenuClose, useMenuContext } from '@ui';
import styles from './menu.module.css';

interface ButtonProps extends ComponentProps<'button'> {
    type: 'button';
}

interface AnchorProps extends ComponentProps<'a'> {
    type: 'link';
}

type Props = ButtonProps | AnchorProps;

export const MenuItem: FC<MenuItemProps & Props> = ({
    isFirst,
    isLast,
    closeOnPress,
    className,
    children,
    ...props
}) => {
    const { onClose } = useMenuContext();

    if (props.type === 'link') {
        return (
            <a
                className={classNames(styles['menu-item'], className)}
                autoFocus={props.autoFocus || isFirst}
                {...props}
                onClick={(e) => {
                    props.onClick?.(e);
                    if (closeOnPress) {
                        onClose();
                    }
                }}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            autoFocus={props.autoFocus || isFirst}
            className={classNames(styles['menu-item'], className)}
            {...props}
            onClick={(e) => {
                props.onClick?.(e);
                if (closeOnPress) {
                    onClose();
                }
            }}
        >
            {children}
        </button>
    );
};
