import { CSSProperties, FC } from "react";
import { colorRampThumbSizes, DEFAULT_SIZE, OpacityRampProps } from "@ui";
import styles from './color-ramp.module.css';

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    value,
    label = 'Opacity',
    size = DEFAULT_SIZE,
    disabled = false,
    onChange,
}) => (
    <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        disabled={disabled}
        aria-label={label}
        className={`${styles['linear-ramp']} ${styles.opacity} ${styles[`linear-size-${size}`]}`}
        style={{
            '--opacity-color': color,
            '--thumb-size': `${colorRampThumbSizes[size]}px`,
        } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
    />
);
