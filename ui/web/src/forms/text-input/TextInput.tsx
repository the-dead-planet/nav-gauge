import { ChangeEvent, ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { TextInputProps, useTheme } from "@ui";
import { Label } from "../../typography";
import styles from './text-input.module.css';

export const TextInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & TextInputProps> = ({
    id,
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    active = false,
    autoSelect = false,
    className,
    ...props
}) => {
    const theme = useTheme();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
        if (autoSelect) {
            e.currentTarget.select();
        }
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
            className
        )}>
            {label ? <Label htmlFor={id} color={color} shade={contentShade} className={styles.label}>{label}</Label> : null}
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                disabled={disabled}
                className={styles.input}
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
