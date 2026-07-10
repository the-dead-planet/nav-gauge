import { FC } from "react";
import { Label, Span } from "../typography";
import styles from './clock-input.module.css';

interface Props {
    id?: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange?: (value: number) => void;
    disabled: boolean;
    label?: string;
}

export const ClockA11yInput: FC<Props> = ({
    id,
    min,
    max,
    step,
    value,
    onChange,
    disabled,
    label,
}) => (
    <>
        <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            disabled={disabled}
            className={styles['a11y-slider']}
            aria-label={label || 'Angle'}
            tabIndex={0}
        />
        {label && (
            <Label htmlFor={id} className={styles['label']}>
                {label}
                <Span tabular>{value}°</Span>
            </Label>
        )}
    </>
);
