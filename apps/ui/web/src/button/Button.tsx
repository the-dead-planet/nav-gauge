import { ComponentProps, FC, MouseEvent, ReactNode, useState } from "react";
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
    glowStyle = 'none',
    size = 'sm',
    corners = 'square',
    active = false,
    themeMode,
    icon,
    tooltip,
    onClick,
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

    const renderButton = (isHovered?: boolean) => (
        <button
            onClick={corners !== 'hexagon' ? onClick : undefined}
            className={classNames(
                styles['button'],
                styles[`mode-${themeMode || theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor || color}`],
                styles[`variant-${variant}`],
                styles[`glow-style-${glowStyle}`],
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                {
                    [styles['interactive']]: !!onClick,
                    [styles['hovered']]: isHovered,
                    [styles['active']]: active,
                    [styles[`only-icon-${size}`]]: !children,
                },
                corners !== 'hexagon' ? className : null
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

    const [isHoveringHud, setIsHoveringHud] = useState(false);

    const button = corners === 'hexagon' ? (
        <Hexagon
            shape="flat-top"
            size={size}
            variant={variant}
            glowStyle={glowStyle}
            themeMode={themeMode}
            color={color}
            highlightColor={highlightColor}
            active={active}
            interactive
            role="button"
            onClick={(e) => {
                try {
                    onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
                } catch (e) {
                    console.log("EERRR", e)
                    //
                }
            }}
            onMouseEnter={() => setIsHoveringHud(true)}
            onMouseLeave={() => setIsHoveringHud(false)}
            style={style}
            className={className}
        >
            {renderButton(isHoveringHud)}
        </Hexagon>
    ) : renderButton();

    if (tooltip) {
        <Tooltip content={tooltip}>
            {button}
        </Tooltip>
    };

    return button;
};
