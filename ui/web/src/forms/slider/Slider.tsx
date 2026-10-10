import { ChangeEvent, ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { SliderProps, useTheme } from "@ui";
import { Label, Span } from "../../typography";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from './slider.module.css';

export const Slider: FC<SliderProps & Omit<ComponentProps<"input">, 'onChange' | 'size'>> = ({
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = 'md',
    variant = 'fill-inverse',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    active = false,
    disabled = false,
    id,
    label,
    showNumberInput = false,
    showStepControls = false,
    ariaLabel,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const accessibleLabel = ariaLabel ?? props['aria-label'] ?? (typeof label === 'string' ? label : undefined);
    const range = max - min;
    const progress = range > 0 ? ((value - min) / range) * 100 : 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(e.target.value));
    };

    const slider = (
        <div
            className={classNames(
                styles['slider-wrapper'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor}`],
                styles[`size-${size}`]
            )}
            style={{ '--track-complete': `${progress}%` } as CSSProperties}
        >
            <input
                type="range"
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={handleChange}
                aria-label={accessibleLabel ?? 'Slider'}
                className={classNames(
                    styles.slider,
                    styles[`size-${size}`],
                    styles[`variant-${variant}`],
                    { [styles.active]: active },
                    className
                )}
                style={style}
                {...props}
            />
        </div>
    );
    const steppedSlider = showStepControls ? (
        <StepControls
            color={color}
            variant={variant}
            size={size}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            ariaLabel={accessibleLabel}
        >
            {slider}
        </StepControls>
    ) : slider;

    return (
        <div className={classNames(styles['container'], {
            [styles['disabled']]: disabled,
        })}>
            {typeof label === 'string' ? (
                <Label htmlFor={id} color={active ? highlightColor : color} shade={active ? highlightContentShade : contentShade} className={styles['label']}>
                    {label} {!showNumberInput ? <Span tabular>{value}</Span> : null}
                </Label>
            ) : label}
            <div
                className={classNames(
                    styles['control-row'],
                    styles[`control-size-${size}`]
                )}
            >
                {steppedSlider}
                {showNumberInput ? (
                    <NumberInput
                        value={value}
                        onChange={(newValue) => onChange?.(newValue)}
                        min={min}
                        max={max}
                        step={step}
                        color={color}
                        contentShade={contentShade}
                        highlightColor={highlightColor}
                        highlightContentShade={highlightContentShade}
                        size={size}
                        variant={variant}
                        disabled={disabled || !onChange}
                        showStepControls={true}
                        ariaLabel={`${accessibleLabel ?? 'Slider'} (#)`}
                    />
                ) : null}
            </div>
        </div>
    );
};
