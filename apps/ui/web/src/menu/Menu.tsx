import { useState, useRef, useEffect, FC, CSSProperties, ComponentProps } from 'react';
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
import { Panel } from '../hud';
import { Transition } from '../transition';

export const Menu: FC<MenuProps & ComponentProps<'button'>> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    placement = 'bottom-right',
    tooltip,
    tooltipPlacement,
    color,
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
                color={color}
                highlightColor={iconActiveColor}
                onClick={handleToggle}
                tooltip={tooltip}
                tooltipPlacement={tooltipPlacement}
                className={styles.trigger}
                {...props}
            />
            {visible && createPortal(
                <Panel
                    forwardRef={containerRef}
                    variant='fill-inverse'
                    className={styles['menu-list']}
                    style={positionStyle}
                >
                    <MenuContext.Provider value={{ onClose: handleClose, triggerRef }}>
                        <Transition slide={menuPosition.bottom ? "to-top" : "to-bottom"} render>
                            {children}
                        </Transition>
                    </MenuContext.Provider>
                </Panel>,
                document.body,
            )}
        </>
    );
};
