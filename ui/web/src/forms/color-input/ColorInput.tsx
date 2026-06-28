import { ChangeEvent, ComponentProps, FC, useRef } from "react";
import classNames from "classnames";
import { ColorInputProps, useTheme } from "@ui";
import styles from './color-input.module.css';

export const ColorInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & ColorInputProps> = ({
    id,
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    className,
    ...props
}) => {
    const theme = useTheme();
    const hlColor = highlightColor || color;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleSwatchClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    return (
        <div className={classNames(
            styles.container,
            styles[`mode-${theme.mode}`],
            styles[`color-${color}`],
            styles[`highlight-${hlColor}`],
            styles[`size-${size}`],
            styles[`variant-${variant}`],
        )}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles['input-wrapper']}>
                <button
                    type="button"
                    className={styles.swatch}
                    style={{ backgroundColor: value }}
                    onClick={handleSwatchClick}
                    disabled={disabled}
                    aria-label="Pick color"
                />
                <span className={styles['hex-value']}>{value}</span>
                <input
                    ref={inputRef}
                    id={id}
                    type="color"
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={classNames(styles['native-picker'], className)}
                    {...props}
                />
            </div>
        </div>
    );
};
