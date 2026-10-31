import { ChangeEvent, ComponentProps, CSSProperties, FC, MouseEvent, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    TextAreaProps,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import styles from "./text-area.module.css";

export const TextArea: FC<Omit<ComponentProps<"textarea">, "onChange" | "value" | "size"> & TextAreaProps> = ({
    id,
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
    highlighted = false,
    autoSelect = false,
    className,
    onClick,
    ...props
}) => {
    const generatedId = useId();
    const textAreaId = id || generatedId;
    const theme = useTheme().forMode(themeMode);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    const handleClick = (event: MouseEvent<HTMLTextAreaElement>) => {
        if (autoSelect) {
            event.currentTarget.select();
        }
        onClick?.(event);
    };

    return (
        <div
            data-appearance-mode={theme.mode}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor}
            data-highlighted={highlighted || undefined}
            data-disabled={disabled || undefined}
            className={classNames(
                styles.container,
                styles[`size-${size}`],
            )}
            style={{
                "--appearance-default-glyphs-override": glyphsShade === undefined
                    ? undefined
                    : theme.color(color, glyphsShade),
                "--appearance-hover-focus-glyphs-override": highlightGlyphsShade === undefined
                    ? undefined
                    : theme.color(highlightColor, highlightGlyphsShade),
                "--appearance-active-pressed-glyphs-override": highlightGlyphsShade === undefined
                    ? undefined
                    : theme.color(highlightColor, highlightGlyphsShade),
            } as CSSProperties}
        >
            {label ? (
                <Label
                    htmlFor={textAreaId}
                    themeMode={themeMode}
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    highlighted={highlighted}
                    disabled={disabled}
                    className={styles.label}
                >
                    {label}
                </Label>
            ) : null}
            <div className={styles.field}>
                <textarea
                    {...props}
                    id={textAreaId}
                    rows={props.rows ?? 1}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onClick={handleClick}
                    disabled={disabled}
                    className={classNames(styles.textarea, className)}
                />
            </div>
        </div>
    );
};
