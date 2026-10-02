import { ComponentProps, CSSProperties, forwardRef } from "react";
import classNames from "classnames";
import { ColorButtonProps, formatColorDescription } from "@ui";
import { Tooltip } from "../../tooltip";
import styles from './color-button.module.css';

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps & Omit<ComponentProps<'button'>, 'value'>>(({
    value,
    label = 'Color',
    size = 'sm',
    selected = false,
    disabled = false,
    className,
    style,
    ...props
}, ref) => {
    const description = formatColorDescription(label, value);
    const button = (
        <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-label={description}
            className={classNames(
                styles.button,
                styles[`size-${size}`],
                {
                    [styles.selected]: selected,
                },
                className,
            )}
            style={{ ...style, '--color-button-value': value } as CSSProperties}
            {...props}
        />
    );

    return <Tooltip content={description}>{button}</Tooltip>;
});

ColorButton.displayName = 'ColorButton';
