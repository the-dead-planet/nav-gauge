import { ComponentProps, CSSProperties, FC, MouseEvent, useState } from "react";
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
    iconRotateX?: number;
    iconRotateZ?: number;
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
    iconRotateX = 0,
    iconRotateZ = 0,
    tooltip,
    tooltipPlacement,
    showTooltipConnection,
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
                    style={{
                        '--rotate-x': `${iconRotateX}deg`,
                        '--rotate-z': `${iconRotateZ}deg`,
                    } as CSSProperties}
                    className={classNames(styles['icon'], {
                        [styles['rotate']]: iconRotateX || iconRotateZ
                    })}
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
                } catch { }
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
        return (
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
        );
    };

    return button;
};
