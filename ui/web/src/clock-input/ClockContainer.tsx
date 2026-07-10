import { ComponentProps, FC } from "react";
import classNames from "classnames";
import styles from './clock-input.module.css';

interface Props extends ComponentProps<'div'> {
    mode: string;
    color: string;
    highlightColor?: string;
    size: string;
    variant?: string;
    disabled: boolean;
}

export const ClockContainer: FC<Props> = ({
    mode,
    color,
    highlightColor,
    size,
    variant,
    disabled,
    className,
    children,
    ...props
}) => {
    const activeHighlight = highlightColor || color;

    return (
        <div
            className={classNames(
                styles.container,
                styles[`mode-${mode}`],
                styles[`color-${color}`],
                styles[`highlight-${activeHighlight}`],
                styles[`size-${size}`],
                variant && styles[`variant-${variant}`],
                { [styles.disabled]: disabled },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
