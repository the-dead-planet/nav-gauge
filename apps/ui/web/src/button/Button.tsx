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

    const tryHandle = (e: MouseEvent<HTMLDivElement>, handler?: (e: MouseEvent<HTMLButtonElement>) => void) => {
        try {
            handler?.(e as unknown as MouseEvent<HTMLButtonElement>);
        } catch {
            //
        }
    };
    const tryHandleKeyboard = (e: KeyboardEvent<HTMLDivElement>, handler?: (e: KeyboardEvent<HTMLButtonElement>) => void) => {
        try {
            handler?.(e as unknown as KeyboardEvent<HTMLButtonElement>);
        } catch {
            //
        }
    };

    const button = corners === 'hexagon' ? (
        <Hexagon
            role="button"
            tabIndex={0}
            onClick={(e) => tryHandle(e, props.onClick)}
            onMouseDown={(e) => tryHandle(e, props.onMouseDown)}
            onMouseUp={(e) => tryHandle(e, props.onMouseUp)}
            onMouseEnter={(e) => tryHandle(e, props.onMouseEnter)}
            onMouseLeave={(e) => tryHandle(e, props.onMouseLeave)}
            onKeyDown={(e) => tryHandleKeyboard(e, props.onKeyDown)}
            onKeyUp={(e) => tryHandleKeyboard(e, props.onKeyUp)}
            size={size}
            variant={variant}
            mode={mode}
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
