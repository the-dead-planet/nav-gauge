import { CSSProperties, FC } from "react";
import { colorRampThumbSizes, HueRampProps } from "@ui";
import styles from './color-ramp.module.css';

export const HueRamp: FC<HueRampProps> = ({ value, label = 'Color', size = 'sm', disabled = false, onChange }) => (
    <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={value}
        disabled={disabled}
        aria-label={`${label} hue`}
        className={`${styles['linear-ramp']} ${styles.hue} ${styles[`linear-size-${size}`]}`}
        style={{ '--thumb-size': `${colorRampThumbSizes[size]}px` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
    />
);
