import { ComponentProps, FC, KeyboardEvent, MouseEvent, ReactNode } from "react";
import classNames from "classnames";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../icons";
import { Tooltip } from "../tooltip";
import { Hexagon } from "../hud";
import styles from './button.module.css';

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
    themeMode,
    icon,
    tooltip,
    children,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
    }
    const hexagonIconSizes = {
        xs: 16,
        sm: 20,
        md: 28,
    }
    const iconSize = corners === 'hexagon' ? hexagonIconSizes[size] : iconSizes[size];

    const buttonBase = (
        <button
            className={classNames(
                styles['button'],
                styles[`mode-${themeMode || theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor || color}`],
                styles[`variant-${corners === 'hexagon' ? 'ghost' : variant}`],
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                {
                    [styles['interactive']]: !!props.onClick,
                    [styles['active']]: active,
                    [styles[`only-icon-${size}`]]: !children
                },
                className
            )}
            style={corners !== 'hexagon' ? style : undefined}
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
            shape="flat-top"
            size={size}
            variant={variant}
            themeMode={themeMode}
            color={color}
            highlightColor={highlightColor || color}
            interactive
            hoverStyle="animate-borders-glow"
            style={style}
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
