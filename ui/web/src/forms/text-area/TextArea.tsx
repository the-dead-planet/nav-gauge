import { ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { TextAreaProps, useTheme } from "@ui";
import styles from './text-area.module.css';

export const TextArea: FC<Omit<ComponentProps<'textarea'>, 'size'> & TextAreaProps> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    autoSelect = false,
    onClick,
    className,
    ...props
}) => {
    const theme = useTheme();

    const handleClick = (event: MouseEvent<HTMLTextAreaElement>) => {
        if (autoSelect) {
            event.currentTarget.select();
        }
        onClick?.(event);
    };

    return (
        <div className={classNames(
            styles.container,
            styles[`mode-${theme.mode}`],
            styles[`color-${color}`],
            styles[`highlight-${highlightColor}`],
            styles[`size-${size}`],
            styles[`variant-${variant}`],
        )}>
            <label htmlFor={props.id} className={styles.label}>{label}</label>
            <textarea
                onClick={handleClick}
                className={classNames(styles.textarea, className)}
                {...props}
            />
        </div>
    );
};
