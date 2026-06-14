import { useState, useRef, useEffect, FC, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
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
import styles from './menu.module.css';

export const Menu: FC<MenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    placement = 'bottom-right',
    children,
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
        const handler = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current?.contains(e.target as Node) && !containerRef.current?.contains(e.target as Node)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, [visible]);

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
                active={visible}
                highlightColor={iconActiveColor}
                onClick={handleToggle}
                className={styles.trigger}
            />
            {visible && createPortal(
                <div
                    ref={containerRef}
                    className={styles.menuList}
                    style={positionStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuContext.Provider value={{ onClose: handleClose }}>
                        {children}
                    </MenuContext.Provider>
                </div>,
                document.body,
            )}
        </>
    );
};
