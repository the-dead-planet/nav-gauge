import { ChangeEvent, ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { DEFAULT_COLOR, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, TextInputProps, useTheme } from "@ui";
import { Label } from "../../design-system/typography";
import styles from './text-input.module.css';

export const TextInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & TextInputProps> = ({
    id,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    value,
    onChange,
    disabled = false,
    highlighted = false,
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
            highlighted && !disabled && styles.highlighted,
            className
        )}>
            {label ? <Label htmlFor={id} color={color} shade={glyphsShade} className={styles.label}>{label}</Label> : null}
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                disabled={disabled}
                className={styles.input}
                style={(highlighted ? highlightGlyphsShade : glyphsShade) === undefined ? undefined : { color: theme.color(highlighted ? highlightColor : color, highlighted ? highlightGlyphsShade : glyphsShade) }}
                {...props}
                onFocus={(event) => {
                    if (highlightGlyphsShade !== undefined) {
                        event.currentTarget.style.color = theme.color(highlightColor, highlightGlyphsShade);
                    }
                    props.onFocus?.(event);
                }}
                onBlur={(event) => {
                    event.currentTarget.style.color = glyphsShade === undefined ? '' : theme.color(color, glyphsShade);
                    props.onBlur?.(event);
                }}
            />
        </div>
    );
};
