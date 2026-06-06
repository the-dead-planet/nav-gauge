import { useState, useRef, useEffect, useCallback, FC, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    getMenuPosition,
    MenuProps,
} from '@ui';
import styles from './menu.module.css';

export const Menu: FC<MenuProps> = ({
    placement = 'bottom-right',
    children,
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const triggerRef = useRef<HTMLButtonElement>(null);

    const open = useCallback(() => {
        const el = triggerRef.current;
        if (!el) {
            return;
        };
        const { left, top, width, height } = el.getBoundingClientRect();
        setMenuPosition(getMenuPosition(menuAnchor, getIconAnchorPoint(iconAnchor, left, top, width, height), window.innerWidth, window.innerHeight));
        setVisible(true);
    }, [iconAnchor, menuAnchor]);

    const close = useCallback(() => setVisible(false), []);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const handler = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, [visible, close]);

    const positionStyle: CSSProperties = {};
    
    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    return (
        <>
            <button
                ref={triggerRef}
                onClick={open}
                className={styles.trigger}
            >
                ⋮
            </button>
            {visible && createPortal(
                <div
                    className={styles.overlay}
                    onClick={close}
                >
                    <div
                        className={styles.menuList}
                        style={positionStyle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuContext.Provider value={{ close }}>
                            {children}
                        </MenuContext.Provider>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
};
