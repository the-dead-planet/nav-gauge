import { ComponentProps, FC, useId } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    getIconAndMenuAnchors,
    Icons,
    MenuContext,
    MenuProps,
} from '@ui';
import { Button } from '../../gizmos/button';
import { Panel } from '../../hud';
import { Transition } from '../../motion/transition';
import { useMenu } from './useMenu';
import styles from './menu.module.css';

interface Props extends MenuProps {
    menuListClassName?: string;
}

export const Menu: FC<Props & ComponentProps<'button'>> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    color = DEFAULT_COLOR,
    size = iconSize ?? DEFAULT_SIZE,
    variant = DEFAULT_SURFACE_VARIANT,
    glyphsShade,
    highlightColor = iconActiveColor ?? color,
    highlightGlyphsShade,
    highlighted = false,
    disabled = false,
    placement = 'bottom-right',
    triggerAccessibilityLabel,
    triggerActive = false,
    menuListClassName,
    id,
    'aria-label': accessibilityLabel,
    onClick,
    children,
    ...props
}) => {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const { icon: triggerAnchor, menu: popupAnchor } =
        getIconAndMenuAnchors(placement);
    const {
        visible,
        toggle,
        close,
        triggerRef,
        containerRef,
        popupPosition,
        onMenuKeyDown,
    } = useMenu({ disabled, triggerAnchor, popupAnchor });

    return (
        <>
            <Button
                {...props}
                id={triggerId}
                ref={triggerRef}
                variant={variant}
                icon={icon}
                size={size}
                glyphsShade={glyphsShade}
                highlightGlyphsShade={highlightGlyphsShade}
                highlighted={visible || triggerActive || highlighted}
                disabled={disabled}
                color={color}
                highlightColor={highlightColor}
                onClick={(event) => {
                    onClick?.(event);
                    if (!event.defaultPrevented) {
                        toggle();
                    }
                }}
                aria-label={triggerAccessibilityLabel ?? accessibilityLabel}
                aria-haspopup="menu"
                aria-expanded={visible}
            />
            {visible &&
                createPortal(
                    <Panel
                        forwardRef={containerRef}
                        variant="fill-inverse"
                        color={color}
                        elevationLayer="dropdown"
                        className={classNames(
                            styles['menu-list'],
                            styles[`size-${size}`],
                            menuListClassName,
                        )}
                        style={popupPosition}
                        role="menu"
                        data-popup-trigger-id={triggerId}
                        aria-orientation="vertical"
                        onKeyDown={onMenuKeyDown}
                    >
                        <MenuContext.Provider
                            value={{
                                color,
                                highlightColor,
                                size,
                                onClose: close,
                                triggerRef,
                            }}
                        >
                            <Transition
                                slide={
                                    popupPosition.bottom
                                        ? 'to-top'
                                        : 'to-bottom'
                                }
                                render
                            >
                                {children}
                            </Transition>
                        </MenuContext.Provider>
                    </Panel>,
                    document.body,
                )}
        </>
    );
};
