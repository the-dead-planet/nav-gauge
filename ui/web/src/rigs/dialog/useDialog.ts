import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useOverlayDismiss } from '../useOverlayDismiss';

const focusableSelector =
    'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

export const useDialog = () => {
    const [render, setRender] = useState(true);
    const dialogRef = useRef<HTMLDivElement>(null);
    const close = () => setRender(false);
    useOverlayDismiss({
        visible: render,
        containerRef: dialogRef,
        dismissOnClickAway: false,
        onClose: close,
    });
    useEffect(() => {
        const previousFocus = document.activeElement;
        dialogRef.current
            ?.querySelector<HTMLElement>(focusableSelector)
            ?.focus();

        return () => {
            if (
                previousFocus instanceof HTMLElement &&
                previousFocus.isConnected
            ) {
                previousFocus.focus();
            }
        };
    }, []);

    const onKeyDown = (event: KeyboardEvent) => {
        if (
            event.key !== 'Tab' ||
            !dialogRef.current?.contains(event.target as Node)
        ) {
            return;
        }
        const controls =
            dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    };
    return { render, close, dialogRef, onKeyDown };
};
