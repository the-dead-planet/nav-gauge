import { KeyboardEvent, RefObject, useEffect, useState } from "react";
import { DropdownProps } from "@ui";

interface Props<T> extends Pick<
    DropdownProps<T>,
    "value" | "options" | "onChange"
> {
    listRef: RefObject<HTMLUListElement | null>;
    visible: boolean;
    onClose: (restoreFocus?: boolean) => void;
}

export function useDropdownList<T>({
    value,
    options,
    onChange,
    listRef,
    visible,
    onClose,
}: Props<T>) {
    const [activeIndex, setActiveIndex] = useState(() =>
        Math.max(
            0,
            options.findIndex((option) => option.value === value),
        ),
    );
    const focusedIndex = Math.max(0, Math.min(activeIndex, options.length - 1));

    useEffect(() => {
        if (!visible) {
            return;
        }
        const option = listRef.current?.children[focusedIndex];
        if (option instanceof HTMLElement) {
            option.focus({ preventScroll: true });
            option.scrollIntoView({ block: "nearest" });
        } else {
            listRef.current?.focus();
        }
    }, [focusedIndex, listRef, visible]);

    const select = (index: number) => {
        const option = options[index];
        if (option) {
            onChange?.(option.value);
            onClose();
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex(Math.min(focusedIndex + 1, options.length - 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                setActiveIndex(Math.max(focusedIndex - 1, 0));
                break;
            case "Home":
                event.preventDefault();
                setActiveIndex(0);
                break;
            case "End":
                event.preventDefault();
                setActiveIndex(options.length - 1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                select(focusedIndex);
                break;
            case "Escape":
                event.preventDefault();
                event.stopPropagation();
                onClose();
                break;
            case "Tab":
                onClose();
                break;
        }
    };

    return { select, onKeyDown, setActiveIndex };
}
