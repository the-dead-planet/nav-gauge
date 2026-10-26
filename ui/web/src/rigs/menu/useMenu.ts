import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MenuAnchor } from '@ui';
import { useOverlayDismiss } from '../useOverlayDismiss';
import { usePopupPosition } from '../popup/usePopupPosition';

export const useMenu = ({
    disabled,
    triggerAnchor,
    popupAnchor,
}: {
    disabled: boolean;
    triggerAnchor: MenuAnchor;
    popupAnchor: MenuAnchor;
}) => {
    const [open, setOpen] = useState(false);
    const visible = open && !disabled;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { containerRef, popupPosition } = usePopupPosition({
        visible,
        anchor: triggerRef,
        triggerAnchor,
        popupAnchor,
    });
    const close = () => {
        setOpen(false);
        triggerRef.current?.focus();
    };
    useOverlayDismiss({
        visible,
        anchor: triggerRef,
        containerRef,
        onClose: close,
    });
    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled]);
    useEffect(() => {
        if (visible) {
            containerRef.current
                ?.querySelector<HTMLElement>(
                    '[role="menuitem"]:not([aria-disabled="true"])',
                )
                ?.focus();
        }
    }, [visible]);

    const onMenuKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
        }
        if (event.key === 'Tab') {
            close();
            return;
        }
        const items = Array.from(
            containerRef.current?.querySelectorAll<HTMLElement>(
                '[role="menuitem"]:not([aria-disabled="true"])',
            ) ?? [],
        );
        if (items.length === 0) {
            return;
        }
        const currentIndex = items.findIndex(
            (item) => item === document.activeElement,
        );
        let nextIndex: number;
        switch (event.key) {
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + items.length) % items.length;
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = items.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        items[nextIndex]?.focus();
    };

    return {
        visible,
        toggle: () => setOpen((current) => !current),
        close,
        triggerRef,
        containerRef,
        popupPosition,
        onMenuKeyDown,
    };
};
