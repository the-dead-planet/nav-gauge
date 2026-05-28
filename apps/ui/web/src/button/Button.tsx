import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { ButtonProps, useTheme } from "@ui";
import styles from './button.module.css';

export const Button: FC<ComponentProps<'button'> & ButtonProps> = ({
    color = 'neutral',
    variant = 'ghost',
    size = 'sm',
    corners = 'square',
    active = false,
    children,
    className,
    ...props
}) => {
    const theme = useTheme();

    return (
        <button
            className={classNames(
                styles['button'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`variant-${variant}`],
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
