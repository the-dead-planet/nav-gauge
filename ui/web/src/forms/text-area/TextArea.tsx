import { ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { DEFAULT_FILL_VARIANT, DEFAULT_SIZE, TextAreaProps, useTheme } from "@ui";
import { Label } from "../../design-system/typography";
import styles from './text-area.module.css';

export const TextArea: FC<Omit<ComponentProps<'textarea'>, 'size'> & TextAreaProps> = ({
    color = 'neutral',
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    autoSelect = false,
    highlighted = false,
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
            highlighted && !disabled && styles.highlighted,
        )}>
            <Label htmlFor={props.id} color={color} shade={glyphsShade} disabled={disabled} className={styles.label}>{label}</Label>
            <textarea
                onClick={handleClick}
                className={classNames(styles.textarea, className)}
                disabled={disabled}
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
