import { useEffect, useRef, useState, CSSProperties, FC } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { getMenuPosition, MenuPosition, MenuAnchor, getIconAnchorPoint, PopupProps } from '@ui';
import { Transition } from '../transition';
import type { TransitionProps } from '@ui';
import styles from './popup.module.css';

interface Props extends PopupProps {
    overlayClassName?: string;
    popupClassName?: string;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    placement = 'top-left',
    visible,
    onClose,
    overlayClassName,
    popupClassName,
    children,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    useEffect(() => {
        if (!visible) {
            return;
        }

        const computePosition = () => {
            let anchorRect: DOMRect;
            let iconAnchor: { x: number; y: number };

            if (anchor && anchor.current) {
                anchorRect = anchor.current.getBoundingClientRect();
                iconAnchor = getIconAnchorPoint(placement, anchorRect.left, anchorRect.top, anchorRect.width, anchorRect.height);
            } else if (position) {
                iconAnchor = position;
            } else {
                return;
            }

            const menuAnchor = placement.startsWith('top') ? 'bottom' : 'top';
            const horizontal = placement.endsWith('right') ? 'right' : 'left';
            const menuAnchorKey = `${menuAnchor}-${horizontal}` as MenuAnchor;

            setMenuPosition(getMenuPosition(menuAnchorKey, iconAnchor, window.innerWidth, window.innerHeight));
        };

        computePosition();
        window.addEventListener('scroll', computePosition, true);

        return () => window.removeEventListener('scroll', computePosition, true);
    }, [visible, anchor, position, placement]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const mousedownHandler = (e: MouseEvent) => {
            if (
                !containerRef.current?.contains(e.target as Node) &&
                !(anchor && anchor.current?.contains(e.target as Node))
            ) {
                onClose();
            }
        };
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [visible, onClose, anchor]);

    if (!visible) {
        return null;
    }

    const positionStyle: CSSProperties = {};
    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    const slide: TransitionProps['slide'] = menuPosition.bottom ? 'to-top' : 'to-bottom';

    return createPortal(
        <div className={classNames(styles.overlay, overlayClassName)}>
            <div
                ref={containerRef}
                className={classNames(styles.popup, popupClassName)}
                style={positionStyle}
                {...props}
            >
                <Transition slide={slide} render={visible} onUnmount={onClose}>
                    {children}
                </Transition>
            </div>
        </div>,
        document.body,
    );
};
