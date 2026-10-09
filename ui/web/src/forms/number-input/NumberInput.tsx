import { ChangeEvent, ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { ColorShade, Icons, NumberInputProps, SizeVariant, useTheme } from "@ui";
import { Button } from "../../button";
import { Label } from "../../typography";
import { useStepRepeatButton } from '../step-controls/useStepRepeatButton';
import styles from './number-input.module.css';

export const NumberInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & NumberInputProps> = ({
    id,
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    min,
    max,
    step,
    disabled = false,
    autoSelect = false,
    ariaLabel,
    unit,
    showStepControls = true,
    className,
    ...props
}) => {
    const theme = useTheme();
    const getStepButtonProps = useStepRepeatButton({ value, onChange, step, min, max, disabled });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const parsed = Number(e.target.value);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
        if (autoSelect) {
            e.currentTarget.select();
        }
    };

    const contentShade: ColorShade = variant === 'fill-translucent'
        ? 500
        : variant === 'fill'
            ? theme.isLight ? 100 : 900
            : theme.isLight ? 900 : 100;
    const disabledShade: ColorShade = theme.isLight ? 300 : 700;
    const incrementDisabled = disabled || (max !== undefined && value >= max);
    const decrementDisabled = disabled || (min !== undefined && value <= min);

    const buttonSizes: { [key in SizeVariant]: SizeVariant } = {
        xs: 'xs',
        sm: 'xs',
        md: 'sm',
        lg: 'md',
    };

    return (
        <div className={classNames(
            styles.container,
            styles[`mode-${theme.mode}`],
            styles[`color-${color}`],
            styles[`highlight-${highlightColor}`],
            styles[`size-${size}`],
            styles[`variant-${variant}`],
            disabled && styles.disabled,
        )}>
            {typeof label === 'string' ? (
                <Label htmlFor={id} className={styles.label}>
                    {label}
                </Label>
            ) : label}
            <div className={styles['input-wrapper']}>
                <div className={styles['input-with-unit']}>
                    <input
                        id={id}
                        type="number"
                        value={value}
                        onChange={handleChange}
                        onClick={handleClick}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
                        className={classNames(styles.input, className)}
                        {...props}
                    />
                    {unit ? <span className={styles['unit']}>{unit}</span> : null}
                </div>
                {showStepControls ? <div className={styles.steppers}>
                    <Button
                        {...getStepButtonProps(1)}
                        icon={Icons.NounProject.ChevronDownSingle}
                        iconRotateZ={180}
                        disabled={incrementDisabled}
                        color={color}
                        highlightColor={highlightColor}
                        shade={incrementDisabled ? disabledShade : contentShade}
                        size={buttonSizes[size]}
                        className={styles['stepper-btn']}
                        aria-label={ariaLabel ? `${ariaLabel} (+)` : '+'}
                    />
                    <Button
                        {...getStepButtonProps(-1)}
                        icon={Icons.NounProject.ChevronDownSingle}
                        disabled={decrementDisabled}
                        color={color}
                        highlightColor={highlightColor}
                        shade={decrementDisabled ? disabledShade : contentShade}
                        size={buttonSizes[size]}
                        className={styles['stepper-btn']}
                        aria-label={ariaLabel ? `${ariaLabel} (−)` : '−'}
                    />
                </div> : null}
            </div>
        </div>
    );
};
