import { ChangeEvent, ComponentProps, FC, useRef } from "react";
import classNames from "classnames";
import { ColorInputProps, parseColor, toHexColor, useTheme } from "@ui";
import { Label } from "../../typography";
import { ColorButton } from "../color-button";
import styles from './color-input.module.css';

export const ColorInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & ColorInputProps> = ({
    id,
    color = 'neutral',
    highlightColor = color,
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
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
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
            <Label htmlFor={id} className={styles.label}>{label}</Label>
            <div className={styles['input-wrapper']}>
                <ColorButton
                    value={value}
                    label={label}
                    size={size}
                    className={styles.swatch}
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                />
                <span className={styles['hex-value']}>{value}</span>
                <input
                    ref={inputRef}
                    id={id}
                    type="color"
                    value={toHexColor(parseColor(value))}
                    onChange={handleChange}
                    disabled={disabled}
                    className={classNames(styles['native-picker'], className)}
                    {...props}
                />
            </div>
        </div>
    );
};
