import { ComponentProps, CSSProperties, FC } from "react";
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
    disabled,
    type = 'button',
    icon,
    iconRotateX = 0,
    iconRotateZ = 0,
    tooltip,
    tooltipPlacement,
    showTooltipConnection,
    onClick,
    'aria-label': ariaLabel,
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

    const button = (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel ?? (!children && typeof tooltip === 'string' ? tooltip : undefined)}
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
                    [styles['interactive']]: !!onClick && !disabled,
                    [styles['active']]: active,
                    [styles[`only-icon-${size}`]]: !children,
                    [styles['disabled']]: disabled,
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
                    style={{
                        '--rotate-x': `${iconRotateX}deg`,
                        '--rotate-z': `${iconRotateZ}deg`,
                        cursor: disabled ? 'not-allowed' : undefined
                    } as CSSProperties}
                    className={classNames(styles['icon'], {
                        [styles['rotate']]: iconRotateX || iconRotateZ
                    })}
                />
            ) : null}
            {children}
        </button>
    );

    const hasTooltip = tooltip !== null && tooltip !== undefined && tooltip !== false && tooltip !== '';
    const buttonWithTooltip = hasTooltip ? (
        <Tooltip
            placement={tooltipPlacement}
            content={tooltip}
            color={highlightColor || color}
            variant={variant === 'fill'
                ? 'fill'
                : variant === 'fill-translucent'
                    ? 'fill-translucent'
                    : 'fill-inverse'}
            showConnection={showTooltipConnection}
        >
            {button}
        </Tooltip>
    ) : button;

    if (corners === 'hexagon') {
        return (
        <Hexagon
            shape="flat-top"
            size={size}
            variant={variant}
            glowStyle={glowStyle}
            themeMode={themeMode}
            color={color}
            highlightColor={highlightColor}
            active={active}
            interactive={!disabled}
            style={disabled ? { ...style, opacity: 0.45, cursor: 'not-allowed' } : style}
            className={className}
        >
            {buttonWithTooltip}
        </Hexagon>
        );
    }

    return buttonWithTooltip;
};
