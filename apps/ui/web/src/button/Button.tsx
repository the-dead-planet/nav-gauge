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

    const tryHandle = (e: MouseEvent<SVGSVGElement>, handler?: (e: MouseEvent<HTMLButtonElement>) => void) => {
        e.stopPropagation();
        try {
            handler?.(e as unknown as MouseEvent<HTMLButtonElement>);
        } catch {
            console.error("eee", e)
        }
    };
    const tryHandleKeyboard = (e: KeyboardEvent<SVGSVGElement>, handler?: (e: KeyboardEvent<HTMLButtonElement>) => void) => {
        e.stopPropagation()
        try {
            handler?.(e as unknown as KeyboardEvent<HTMLButtonElement>);
        } catch {
            //
        }
    };

    const button = corners === 'hexagon' ? (
        <Hexagon
            size={size}
            variant={variant}
            themeMode={themeMode}
            color={color}
            highlightColor={highlightColor || color}
            interactive
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
