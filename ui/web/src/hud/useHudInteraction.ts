import { ComponentProps, useState } from "react";

type InteractionProps = Pick<
    ComponentProps<"div">,
    "onClick" | "onKeyDown" | "onKeyUp" | "onBlur" | "role" | "tabIndex"
> & { disabled: boolean };

export const useHudInteraction = ({
    disabled,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
}: InteractionProps): ComponentProps<"div"> & { "data-pressed"?: boolean } => {
    const [keyboardPressed, setKeyboardPressed] = useState(false);
    return {
        role: role ?? (onClick ? "button" : undefined),
        tabIndex: disabled
            ? onClick || tabIndex !== undefined
                ? -1
                : undefined
            : (tabIndex ?? (onClick ? 0 : undefined)),
        "aria-disabled": disabled || undefined,
        "data-pressed": (!disabled && keyboardPressed) || undefined,
        onClick: disabled ? undefined : onClick,
        onKeyDown: (event) => {
            onKeyDown?.(event);
            if (
                event.defaultPrevented ||
                disabled ||
                !onClick ||
                event.target !== event.currentTarget
            ) {
                return;
            }
            if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                setKeyboardPressed(true);
                if (event.key === "Enter" && !event.repeat) {
                    event.currentTarget.click();
                }
            }
        },
        onKeyUp: (event) => {
            onKeyUp?.(event);
            setKeyboardPressed(false);
            if (
                !event.defaultPrevented &&
                !disabled &&
                onClick &&
                keyboardPressed &&
                event.key === " " &&
                event.target === event.currentTarget
            ) {
                event.preventDefault();
                event.currentTarget.click();
            }
        },
        onBlur: (event) => {
            setKeyboardPressed(false);
            onBlur?.(event);
        },
    };
};
