import { ComponentProps, CSSProperties, FC } from 'react';
import classNames from 'classnames';
import {
    MenuItemProps,
    menuItemLinkIcons,
    resolveMenuItemLinkType,
    ThemeAppearanceVariant,
    useMenuContext,
    useTheme,
} from '@ui';
import { HudSurface } from '../../hud/HudSurface';
import { Icon } from '../../design-system/icons';
import styles from './menu.module.css';

type Props =
    | (ComponentProps<'button'> & { type: 'button' })
    | (ComponentProps<'a'> & { type: 'link' });

export const MenuItem: FC<MenuItemProps & Props> = ({
    isFirst,
    closeOnPress = false,
    color,
    highlightColor,
    selected,
    linkType,
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
    const defaultGlyphsShade = selected ? highlightGlyphsShade : glyphsShade;
    const variant: ThemeAppearanceVariant = selected
        ? 'menu-item-selected'
        : 'menu-item';
    const resolvedLinkType =
        linkType ??
        (props.type === 'link'
            ? resolveMenuItemLinkType(
                  props.href,
                  props.target,
                  typeof window === 'undefined'
                      ? undefined
                      : window.location.href,
              )
            : undefined);
    const content = (
        <>
            <span className={styles.label}>{children}</span>
            {resolvedLinkType ? (
                <Icon
                    src={menuItemLinkIcons[resolvedLinkType]}
                    size={size ?? context.size}
                    data-appearance-glyph
                    data-link-type={resolvedLinkType}
                />
            ) : null}
        </>
    );
    const appearanceProps = {
        variant,
        color: selectedColor,
        highlightColor: selectedHighlightColor,
        highlighted,
        disabled,
        interactive: true,
        rectangle: true,
        role: selected === undefined ? 'menuitem' : 'menuitemradio',
        'aria-checked': selected,
        'aria-disabled': disabled,
        className: classNames(
            styles['menu-item'],
            styles[`size-${size ?? context.size}`],
            className,
        ),
        style: {
            ...style,
            ...(defaultGlyphsShade === undefined
                ? undefined
                : {
                      '--appearance-default-glyphs-override': theme.color(
                          selected ? selectedHighlightColor : selectedColor,
                          defaultGlyphsShade,
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
            {content}
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
            {content}
        </HudSurface>
    );
};
