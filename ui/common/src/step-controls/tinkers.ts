import { useEffect, useRef } from 'react';
import { addDecimalStep } from '../number-input';

const REPEAT_DELAY_MILLISECONDS = 400;
const REPEAT_INTERVAL_MILLISECONDS = 80;

export interface StepRepeatOptions {
    value: number;
    onChange?: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export const useStepRepeat = ({
    value,
    onChange,
    step = 1,
    min,
    max,
    disabled = false,
}: StepRepeatOptions) => {
    const valueRef = useRef(value);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    valueRef.current = value;

    const stop = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
    };

    const changeBy = (direction: -1 | 1) => {
        if (disabled || !onChange) {
            return false;
        }

        const nextValue = addDecimalStep(valueRef.current, direction * step);
        if ((min !== undefined && nextValue < min) || (max !== undefined && nextValue > max)) {
            stop();
            return false;
        }

        valueRef.current = nextValue;
        onChange(nextValue);
        return true;
    };

    const start = (direction: -1 | 1) => {
        stop();
        if (!changeBy(direction)) {
            return;
        }
        const repeat = () => {
            if (changeBy(direction)) {
                timerRef.current = setTimeout(repeat, REPEAT_INTERVAL_MILLISECONDS);
            }
        };
        timerRef.current = setTimeout(repeat, REPEAT_DELAY_MILLISECONDS);
    };

    useEffect(() => () => {
        clearTimeout(timerRef.current);
    }, []);

    return { changeBy, start, stop };
};
