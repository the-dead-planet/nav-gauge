import { ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { TextAreaProps, useTheme } from "@ui";
import { Label } from "../../typography";
import styles from './text-area.module.css';

export const TextArea: FC<Omit<ComponentProps<'textarea'>, 'size'> & TextAreaProps> = ({
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    autoSelect = false,
    active = false,
    disabled = false,
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
            active && !disabled && styles.active,
        )}>
            <Label htmlFor={props.id} color={color} shade={contentShade} disabled={disabled} className={styles.label}>{label}</Label>
            <textarea
                onClick={handleClick}
                className={classNames(styles.textarea, className)}
                disabled={disabled}
                style={(active ? highlightContentShade : contentShade) === undefined ? undefined : { color: theme.color(active ? highlightColor : color, active ? highlightContentShade : contentShade) }}
                {...props}
                onFocus={(event) => {
                    if (highlightContentShade !== undefined) {
                        event.currentTarget.style.color = theme.color(highlightColor, highlightContentShade);
                    }
                    props.onFocus?.(event);
                }}
                onBlur={(event) => {
                    event.currentTarget.style.color = contentShade === undefined ? '' : theme.color(color, contentShade);
                    props.onBlur?.(event);
                }}
            />
        </div>
    );
};
