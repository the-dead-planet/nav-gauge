import { ChangeEvent, ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { SliderProps, useTheme } from "@ui";
import styles from './slider.module.css';

export const Slider: FC<SliderProps & Omit<ComponentProps<"input">, 'onChange' | 'size'>> = ({
    color = 'neutral',
    highlightColor: hlColor,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    active = false,
    disabled = false,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const highlightColor = hlColor || color;
    const range = max - min;
    const progress = range > 0 ? ((value - min) / range) * 100 : 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(e.target.value));
    };

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
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
    );
};
