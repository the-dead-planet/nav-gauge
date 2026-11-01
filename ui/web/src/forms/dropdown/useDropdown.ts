import {
    CSSProperties,
    KeyboardEvent,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { useOverlayDismiss } from "../../rigs/useOverlayDismiss";
import { usePopupPosition } from "../../rigs/popup/usePopupPosition";

export function useDropdown(disabled: boolean) {
    const [open, setOpen] = useState(false);
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const isOpen = open && !disabled;
    const { containerRef: listRef, popupPosition } =
        usePopupPosition<HTMLUListElement>({
            visible: isOpen,
            anchor: triggerRef,
            triggerAnchor: "bottom-left",
            popupAnchor: "top-left",
        });
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const trigger = triggerRef.current;
        if (!trigger) {
            return;
        }
        const updateWidth = () =>
            setWidth(trigger.getBoundingClientRect().width);
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(trigger);
        return () => observer.disconnect();
    }, [isOpen]);

    const close = (restoreFocus = true) => {
        setOpen(false);
        if (restoreFocus) {
            triggerRef.current?.focus();
        }
    };
    useOverlayDismiss({
        visible: isOpen,
        anchor: triggerRef,
        containerRef: listRef,
        onClose: close,
    });
    const onTriggerKeyDown = (event: KeyboardEvent) => {
        if (
            !disabled &&
            ["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)
        ) {
            event.preventDefault();
            setOpen(true);
        }
    };

    const positionStyle: CSSProperties = {
        ...popupPosition,
        width,
        visibility:
            width && Object.keys(popupPosition).length ? "visible" : "hidden",
    };

    return {
        isOpen,
        listId,
        containerRef,
        triggerRef,
        listRef,
        positionStyle,
        close,
        onTriggerKeyDown,
        toggle: () => {
            if (!disabled) {
                setOpen(!isOpen);
            }
        },
    };
}
