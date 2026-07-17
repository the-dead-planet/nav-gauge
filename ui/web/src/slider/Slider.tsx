import { ChangeEvent, ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { SliderProps, useTheme } from "@ui";
import { Label, Span } from "../typography";
import styles from './slider.module.css';

export const Slider: FC<SliderProps & Omit<ComponentProps<"input">, 'onChange' | 'size'>> = ({
    color = 'neutral',
    highlightColor = color,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    active = false,
    disabled = false,
    id,
    label,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const range = max - min;
    const progress = range > 0 ? ((value - min) / range) * 100 : 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(e.target.value));
    };

    return (
        <div className={classNames(styles['container'])}>
            {typeof label === 'string' ? (
                <Label htmlFor={id} className={styles['label']}>
                    {label} <Span tabular>{value}</Span>
                </Label>
            ) : label}
            <input
                type="range"
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                onChange={handleChange}
                aria-label={props['aria-label'] || (typeof label === 'string' ? label : '') || 'Slider'}
                className={classNames(
                    styles['slider'],
                    styles[`mode-${theme.mode}`],
                    styles[`color-${color}`],
                    styles[`highlight-${highlightColor}`],
                    styles[`size-${size}`],
                    {
                        [styles['active']]: active,
                        [styles['disabled']]: disabled,
                    },
                    className
                )}
                style={{
                    '--track-complete': `${progress}%`,
                    ...style,
                } as CSSProperties}
                {...props}
            />
        </div>
    );
};
