import { ComponentProps, FC, ReactNode } from "react";
import classNames from "classnames";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../icons";
import styles from './button.module.css';
import { Tooltip } from "../tooltip";
import { Hexagon } from "../hud";

interface Props {
    /**
     * Icon to display before the children
     */
    icon?: string;
    tooltip?: ReactNode;
}

export const Button: FC<ComponentProps<'button'> & Props & ButtonProps> = ({
    color = 'neutral',
    highlightColor,
    variant = 'ghost',
    size = 'sm',
    corners = 'square',
    active = false,
    mode,
    icon,
    tooltip,
    children,
    className,
    ...props
}) => {
    const theme = useTheme();
    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
    }
    const iconSize = iconSizes[size];

    const buttonBase = (
        <button
            className={classNames(
                styles['button'],
                styles[`mode-${mode || theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor || color}`],
                styles[`variant-${variant}`],
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                {
                    [styles['interactive']]: !!props.onClick,
                    [styles['active']]: active,
                    [styles[`only-icon-${size}`]]: !children
                },
                className
            )}
            {...props}
        >
            {icon ? (
                <Icon
                    src={icon}
                    width={iconSize}
                    height={iconSize}
                    className={styles['icon']}
                />
            ) : null}
            {children}
        </button>
    );

    const button = corners === 'hexagon' ? (
        <Hexagon
            role="button"
            tabIndex={0}
        >
            {buttonBase}
        </Hexagon>
    ) : buttonBase;

    if (tooltip) {
        <Tooltip content={tooltip}>
            {button}
        </Tooltip>
    };

    return button;
};
