import { ComponentProps, CSSProperties, forwardRef } from "react";
import classNames from "classnames";
import {
    ColorButtonProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_VARIANT,
    formatColorDescription,
    useTheme,
} from "@ui";
import { Tooltip } from "../../gizmos/tooltip";
import styles from "./color-button.module.css";

export const ColorButton = forwardRef<
    HTMLButtonElement,
    ColorButtonProps & Omit<ComponentProps<"button">, "value">
>(
    (
        {
            value,
            label = "Color",
            size = DEFAULT_SIZE,
            selected = false,
            disabled = false,
            className,
            style,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const description = formatColorDescription(label, value);
        const button = (
            <button
                ref={ref}
                type="button"
                disabled={disabled}
                aria-label={description}
                aria-pressed={selected}
                className={classNames(styles.button, className)}
                data-size={size}
                data-appearance-mode={theme.mode}
                data-appearance-variant={DEFAULT_VARIANT}
                data-appearance-color={DEFAULT_COLOR}
                data-appearance-highlight={DEFAULT_COLOR}
                data-highlighted={selected || undefined}
                style={
                    { ...style, "--color-button-value": value } as CSSProperties
                }
                {...props}
            />
        );

        return <Tooltip content={description}>{button}</Tooltip>;
    },
);

ColorButton.displayName = "ColorButton";
