import { RefObject, useEffect, useEffectEvent } from 'react';

const openOverlays: symbol[] = [];

export const useOverlayDismiss = ({
    visible,
    anchor,
    containerRef,
    dismissOnClickAway = true,
    onClose,
}: {
    visible: boolean;
    anchor?: RefObject<HTMLElement | null>;
    containerRef: RefObject<HTMLElement | null>;
    dismissOnClickAway?: boolean;
    onClose: () => void;
}) => {
    const close = useEffectEvent(onClose);
    useEffect(() => {
        if (!visible) {
            return;
        }
        const overlay = Symbol();
        openOverlays.push(overlay);
        const isOwnedTarget = (target: EventTarget | null) => {
            if (!(target instanceof Node)) {
                return false;
            }
            if (
                containerRef.current?.contains(target) ||
                anchor?.current?.contains(target)
            ) {
                return true;
            }
            const triggerId =
                target instanceof Element
                    ? target.closest<HTMLElement>('[data-popup-trigger-id]')
                          ?.dataset.popupTriggerId
                    : undefined;
            const trigger = triggerId
                ? document.getElementById(triggerId)
                : null;
            return Boolean(trigger && containerRef.current?.contains(trigger));
        };
        const onMouseDown = (event: MouseEvent) => {
            if (
                openOverlays[openOverlays.length - 1] === overlay &&
                dismissOnClickAway &&
                !isOwnedTarget(event.target)
            ) {
                close();
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                !event.defaultPrevented &&
                event.key === 'Escape' &&
                openOverlays[openOverlays.length - 1] === overlay
            ) {
                event.preventDefault();
                close();
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            openOverlays.splice(openOverlays.indexOf(overlay), 1);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [visible, anchor, containerRef, dismissOnClickAway]);
};
