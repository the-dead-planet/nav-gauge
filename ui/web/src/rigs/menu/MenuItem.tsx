import { ComponentProps, CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { MenuItemProps, useMenuContext, useTheme } from '@ui';
import { HudSurface } from '../../hud/HudSurface';
import styles from './menu.module.css';

type Props =
    | (ComponentProps<'button'> & { type: 'button' })
    | (ComponentProps<'a'> & { type: 'link' });

export const MenuItem: FC<MenuItemProps & Props> = ({
    isFirst,
    closeOnPress = false,
    color,
    highlightColor,
    variant = 'ghost',
    highlighted = false,
    disabled = false,
    size,
    glyphsShade,
    highlightGlyphsShade,
    className,
    style,
    children,
    ...props
}) => {
    const context = useMenuContext();
    const theme = useTheme();
    const selectedColor = color ?? context.color;
    const selectedHighlightColor =
        highlightColor ?? context.highlightColor ?? selectedColor;
    const appearanceProps = {
        variant,
        color: selectedColor,
        highlightColor: selectedHighlightColor,
        highlighted,
        disabled,
        interactive: true,
        rectangle: true,
        role: 'menuitem',
        'aria-disabled': disabled,
        className: classNames(
            styles['menu-item'],
            styles[`size-${size ?? context.size}`],
            className,
        ),
        style: {
            ...style,
            ...(glyphsShade === undefined
                ? undefined
                : {
                      '--appearance-default-glyphs-override': theme.color(
                          selectedColor,
                          glyphsShade,
                      ),
                  }),
            ...(highlightGlyphsShade === undefined
                ? undefined
                : {
                      '--appearance-hover-focus-glyphs-override': theme.color(
                          selectedHighlightColor,
                          highlightGlyphsShade,
                      ),
                      '--appearance-active-pressed-glyphs-override':
                          theme.color(
                              selectedHighlightColor,
                              highlightGlyphsShade,
                          ),
                  }),
        } as CSSProperties,
    };

    return props.type === 'link' ? (
        <HudSurface
            as="a"
            {...props}
            {...appearanceProps}
            href={disabled ? undefined : props.href}
            tabIndex={disabled ? -1 : props.tabIndex}
            autoFocus={!disabled && (props.autoFocus || isFirst)}
            onClick={(event) => {
                if (disabled) {
                    event.preventDefault();
                    return;
                }
                props.onClick?.(event);
                if (closeOnPress && !event.defaultPrevented) {
                    context.onClose();
                }
            }}
        >
            {children}
        </HudSurface>
    ) : (
        <HudSurface
            as="button"
            {...props}
            {...appearanceProps}
            autoFocus={!disabled && (props.autoFocus || isFirst)}
            onClick={(event) => {
                props.onClick?.(event);
                if (closeOnPress && !event.defaultPrevented) {
                    context.onClose();
                }
            }}
        >
            {children}
        </HudSurface>
    );
};
