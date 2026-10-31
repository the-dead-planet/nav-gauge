import { ChangeEvent, ComponentProps, CSSProperties, FC, MouseEvent, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    Icons,
    NumberInputProps,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { useStepRepeatButton } from "../step-controls/useStepRepeatButton";
import styles from "./number-input.module.css";

export const NumberInput: FC<Omit<ComponentProps<"input">, "onChange" | "value" | "type" | "size"> & NumberInputProps> = ({
    id,
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    value,
    onChange,
    min,
    max,
    step,
    disabled = false,
    highlighted = false,
    autoSelect = false,
    ariaLabel,
    unit,
    showStepControls = true,
    className,
    onClick,
    ...props
}) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const theme = useTheme().forMode(themeMode);
    const getStepButtonProps = useStepRepeatButton({ value, onChange, step, min, max, disabled });
    const incrementDisabled = disabled || (max !== undefined && value >= max);
    const decrementDisabled = disabled || (min !== undefined && value <= min);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const parsed = Number(event.target.value);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
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
            className={classNames(styles.container, styles[`size-${size}`])}
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
            {typeof label === "string" ? (
                <label htmlFor={inputId} className={styles.label}>{label}</label>
            ) : label}
            <div className={styles.field}>
                <div className={styles["input-with-unit"]}>
                    <input
                        {...props}
                        id={inputId}
                        type="number"
                        value={value}
                        onChange={handleChange}
                        onClick={handleClick}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
                        className={classNames(styles.input, className)}
                    />
                    {unit ? <span className={styles.unit}>{unit}</span> : null}
                </div>
                {showStepControls ? (
                    <div className={styles.steppers}>
                        <button
                            {...getStepButtonProps(1)}
                            type="button"
                            className={styles.stepper}
                            disabled={incrementDisabled}
                            aria-label={ariaLabel ? `${ariaLabel} (+)` : "+"}
                        >
                            <Icon
                                src={Icons.NounProject.ChevronDownSingle}
                                size={size}
                                className={styles.rotate}
                            />
                        </button>
                        <button
                            {...getStepButtonProps(-1)}
                            type="button"
                            className={styles.stepper}
                            disabled={decrementDisabled}
                            aria-label={ariaLabel ? `${ariaLabel} (−)` : "−"}
                        >
                            <Icon
                                src={Icons.NounProject.ChevronDownSingle}
                                size={size}
                            />
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
