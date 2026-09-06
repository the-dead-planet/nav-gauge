import { useEffect, useRef, useState, CSSProperties, FC } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { getMenuPosition, MenuPosition, MenuAnchor, getIconAnchorPoint, PopupProps } from '@ui';
import { Transition } from '../transition';
import type { TransitionProps } from '@ui';
import styles from './popup.module.css';
import { Panel } from '../hud';

let popupCounter = 0;
const openPopups: number[] = [];

interface Props extends PopupProps {
    overlayClassName?: string;
    popupClassName?: string;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    placement = 'top-left',
    dismissOnClickAway = true,
    variant,
    shape,
    visible,
    onClose,
    overlayClassName,
    popupClassName,
    children,
    ...props
}) => {
    const [popupOrder] = useState(() => ++popupCounter);
    const containerRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    useEffect(() => {
        if (!visible) {
            return;
        }
        openPopups.push(popupOrder);

        return () => {
            const index = openPopups.indexOf(popupOrder);
            if (index !== -1) {
                openPopups.splice(index, 1);
            }
        };
    }, [visible, popupOrder]);

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
        window.addEventListener('resize', computePosition);

        let resizeObserver: ResizeObserver | null = null;
        if (anchor?.current) {
            const observedElement = anchor.current.parentElement ?? anchor.current;
            resizeObserver = new ResizeObserver(() => computePosition());
            resizeObserver.observe(observedElement);
        }

        return () => {
            window.removeEventListener('scroll', computePosition, true);
            window.removeEventListener('resize', computePosition);
            resizeObserver?.disconnect();
        };
    }, [visible, anchor, position, placement]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const isTopmost = () => openPopups.length > 0 && Math.max(...openPopups) === popupOrder;
        const mousedownHandler = (e: MouseEvent) => {
            if (!isTopmost() || !dismissOnClickAway) {
                return;
            }
            if (
                !containerRef.current?.contains(e.target as Node) &&
                !(anchor && anchor.current?.contains(e.target as Node))
            ) {
                onClose();
            }
        };
        const keydownHandler = (e: KeyboardEvent) => {
            if (isTopmost() && e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [visible, onClose, anchor, dismissOnClickAway]);

    if (!visible) {
        return null;
    }

    const positionStyle: CSSProperties = {};
    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    const slide: TransitionProps['slide'] = placement.includes('top') ? 'to-top' : 'to-bottom';

    return createPortal(
        <div className={classNames(styles.overlay, overlayClassName)}>
            <Transition slide={slide} render={visible} onUnmount={onClose}>
                <Panel
                    forwardRef={containerRef}
                    variant={variant}
                    shape={shape}
                    className={classNames(styles.popup, popupClassName)}
                    style={positionStyle}
                    {...props}
                >
                    {children}
                </Panel>
            </Transition>
        </div>,
        document.body,
    );
};
