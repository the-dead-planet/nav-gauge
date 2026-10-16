import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { ButtonProps, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Hexagon } from "../../hud";
import styles from './button.module.css';

interface Props {
    /**
     * Icon to display before the children
     */
    icon?: string;
}

export const Button: FC<ComponentProps<'button'> & Props & ButtonProps> = ({
    color = 'neutral',
    contentShade,
    highlightColor,
    highlightContentShade,
    variant = 'ghost',
    activeGlow = 'none',
    size = 'sm',
    corners = 'square',
    active = false,
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
    const iconSize = theme.sizes.control[size].iconSize;
    const effects = theme.resolveAppearance(
        variant,
        color,
        highlightColor || color,
        'default',
    ).effects;

    const button = (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor || color}
            aria-label={ariaLabel ?? (!children && typeof tooltip === 'string' ? tooltip : undefined)}
            className={classNames(
                styles['button'],
                styles[`glow-style-${activeGlow}`],
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                {
                    [styles['interactive']]: !!onClick && !disabled,
                    [styles['active']]: active,
                    [styles[`only-icon-${size}`]]: !children,
                    [styles['disabled']]: disabled,
                    [styles['glyphs-glow']]: effects.glyphsGlow,
                    [styles['depth-inset']]: effects.depth === 'inset',
                },
                corners !== 'hexagon' ? className : null
            )}
            style={{
                ...(corners !== 'hexagon' ? style : undefined),
                ...(contentShade === undefined ? undefined : {
                    '--appearance-default-glyphs-override': theme.color(color, contentShade),
                }),
                ...(highlightContentShade === undefined ? undefined : {
                    '--appearance-interaction-glyphs-override': theme.color(highlightColor || color, highlightContentShade),
                }),
            } as CSSProperties}
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
            activeGlow={activeGlow}
            color={color}
            highlightColor={highlightColor}
            active={active}
            disabled={disabled}
            interactive={!disabled}
            style={disabled ? { ...style, cursor: 'not-allowed' } : style}
            className={className}
        >
            {buttonWithTooltip}
        </Hexagon>
        );
    }

    return buttonWithTooltip;
};
