import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { ButtonProps, DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Hexagon } from "../../hud";
import styles from './button.module.css';
import surface from '../../hud/surface.module.css';

interface Props {
    /**
     * Icon to display before the children
     */
    icon?: string;
}

export const Button: FC<ComponentProps<'button'> & Props & ButtonProps> = ({
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor,
    highlightGlyphsShade,
    variant = DEFAULT_SURFACE_VARIANT,
    activeGlow = 'none',
    size = DEFAULT_SIZE,
    corners = 'square',
    highlighted = false,
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
        highlightColor ?? color,
        'default',
    ).effects;
    const appearanceOverrides: CSSProperties = {
        ...(glyphsShade === undefined ? undefined : {
            '--appearance-default-glyphs-override': theme.color(color, glyphsShade),
        }),
        ...(highlightGlyphsShade === undefined ? undefined : {
            '--appearance-hover-focus-glyphs-override': theme.color(highlightColor ?? color, highlightGlyphsShade),
            '--appearance-active-pressed-glyphs-override': theme.color(highlightColor ?? color, highlightGlyphsShade),
        }),
    } as CSSProperties;

    const button = (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor ?? color}
            data-interactive={corners !== 'hexagon' || undefined}
            data-highlighted={corners !== 'hexagon' && highlighted || undefined}
            data-disabled={disabled || undefined}
            data-glow={activeGlow}
            data-glyphs-glow={effects.glyphsGlow || undefined}
            aria-label={ariaLabel ?? (!children && typeof tooltip === 'string' ? tooltip : undefined)}
            className={classNames(
                styles['button'],
                corners !== 'hexagon' && surface.surface,
                corners !== 'hexagon' && surface.rectangle,
                styles[`size-${size}`],
                styles[`corners-${corners}`],
                {
                    [styles[`has-icon-${size}`]]: !!icon,
                    [styles[`only-icon-${size}`]]: !!icon && !children,
                    [styles['depth-inset']]: effects.depth === 'inset',
                },
                corners !== 'hexagon' ? className : null
            )}
            style={{
                ...(corners !== 'hexagon' ? style : undefined),
                ...(corners !== 'hexagon' ? appearanceOverrides : undefined),
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
                    } as CSSProperties}
                    className={classNames(styles['icon'], surface.glyph, {
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
            color={highlightColor ?? color}
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
                highlighted={highlighted}
                disabled={disabled}
                interactive
                style={{ ...style, ...appearanceOverrides }}
                className={className}
            >
                {buttonWithTooltip}
            </Hexagon>
        );
    }

    return buttonWithTooltip;
};
