import { useState, useRef, useEffect, FC, CSSProperties, ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    getMenuPosition,
    MenuProps,
    Icons,
} from '@ui';
import { Button } from '../button';
import { Transition } from '../transition';
import styles from './menu.module.css';

interface Props extends MenuProps {
    menuListClassName?: string;
}

export const Menu: FC<Props & ComponentProps<'button'>> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    tooltip,
    tooltipPlacement,
    color,
    menuListClassName,
    children,
    ...props
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (visible) {
            setVisible(false);
            return;
        }
        const el = triggerRef.current;
        if (!el) {
            return;
        };
        const { left, top, width, height } = el.getBoundingClientRect();
        setMenuPosition(getMenuPosition(menuAnchor, getIconAnchorPoint(iconAnchor, left, top, width, height), window.innerWidth, window.innerHeight));
        setVisible(true);
    };

    const handleClose = () => setVisible(false);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const mousedownHandler = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current?.contains(e.target as Node) && !containerRef.current?.contains(e.target as Node)) {
                handleClose();
            }
        };
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [visible]);

    useEffect(() => {
        if (visible && containerRef.current) {
            const firstItem = containerRef.current.querySelector<HTMLElement>('[role="menuitem"]');
            firstItem?.focus();
        }
    }, [visible]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = containerRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        if (!items || items.length === 0) return;

        const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                {
                    const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    items[next]?.focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                {
                    const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    items[prev]?.focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
        }
    };

    const positionStyle: CSSProperties = {};

    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    return (
        <>
            <Button
                ref={triggerRef}
                variant="ghost"
                icon={icon}
                size={iconSize}
                active={visible}
                color={color}
                highlightColor={iconActiveColor}
                onClick={handleToggle}
                tooltip={tooltip}
                tooltipPlacement={tooltipPlacement}
                {...props}
            />
            {visible && createPortal(
                <div
                    ref={containerRef}
                    className={classNames(styles['menu-list'], menuListClassName)}
                    style={positionStyle}
                    role="menu"
                    aria-orientation="vertical"
                    onKeyDown={handleKeyDown}
                >
                    <MenuContext.Provider value={{ onClose: handleClose, triggerRef }}>
                        <Transition slide={menuPosition.bottom ? "to-top" : "to-bottom"} render>
                            {children}
                        </Transition>
                    </MenuContext.Provider>
                </div>,
                document.body,
            )}
        </>
    );
};
