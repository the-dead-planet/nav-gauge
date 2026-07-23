import { ChangeEvent, ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { TextInputProps, useTheme } from "@ui";
import styles from './text-input.module.css';

export const TextInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & TextInputProps> = ({
    id,
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
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
        )}>
            {label ? <label htmlFor={id} className={styles.label}>{label}</label> : null}
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                disabled={disabled}
                className={classNames(styles.input, className)}
                {...props}
            />
        </div>
    );
};
