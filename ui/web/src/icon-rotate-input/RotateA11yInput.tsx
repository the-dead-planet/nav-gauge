import { FC, useCallback, useEffect, useRef } from "react";
import { Label } from "../typography";
import styles from './icon-rotate-input.module.css';

interface Props {
    id?: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange?: (value: number) => void;
    onSync?: (value: number) => void;
    disabled: boolean;
    label?: string;
}

export const RotateA11yInput: FC<Props> = ({
    id,
    min,
    max,
    step,
    value,
    onChange,
    onSync,
    disabled,
    label,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef(value);
    const onChangeRef = useRef(onChange);
    const onSyncRef = useRef(onSync);
    valueRef.current = value;
    onChangeRef.current = onChange;
    onSyncRef.current = onSync;

    useEffect(() => {
        const input = inputRef.current;
        if (!input) {
            return;
        }
        if (value !== Number(input.value)) {
            input.value = String(value);
        }
    }, [value]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (!input) {
            return;
        }
        const current = Number(input.value);
        let wrapped: number | null = null;

        if (e.key === 'ArrowLeft' && current <= min) {
            wrapped = max;
        } else if (e.key === 'ArrowRight' && current >= max) {
            wrapped = min;
        }

        if (wrapped !== null) {
            e.preventDefault();
            input.value = String(wrapped);
            onChangeRef.current?.(wrapped);
            onSyncRef.current?.(wrapped);
        }
    }, [min, max]);

    return (
        <>
            <input
                ref={inputRef}
                type="range"
                id={id}
                min={min}
                max={max}
                step={step}
                defaultValue={String(value)}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    onChange?.(newValue);
                    onSync?.(newValue);
                }}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={styles['a11y-slider']}
                aria-label={label || 'Angle'}
                tabIndex={0}
            />
            {label && (
                <Label htmlFor={id} tabular className={styles.label}>
                    {label} {value}°
                </Label>
            )}
        </>
    );
};
