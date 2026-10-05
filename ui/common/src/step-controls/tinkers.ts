import { useEffect, useRef } from 'react';
import { addDecimalStep } from '../number-input';

const REPEAT_DELAY_MILLISECONDS = 400;
const REPEAT_INTERVAL_MILLISECONDS = 80;

interface StepRepeatOptions {
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
    const delayRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
    valueRef.current = value;

    const stop = () => {
        clearTimeout(delayRef.current);
        clearInterval(intervalRef.current);
        delayRef.current = undefined;
        intervalRef.current = undefined;
    };

    const changeBy = (direction: -1 | 1) => {
        if (disabled || !onChange) {
            return;
        }

        const nextValue = addDecimalStep(valueRef.current, direction * step);
        if ((min !== undefined && nextValue < min) || (max !== undefined && nextValue > max)) {
            stop();
            return;
        }

        valueRef.current = nextValue;
        onChange(nextValue);
    };

    const start = (direction: -1 | 1) => {
        stop();
        changeBy(direction);
        delayRef.current = setTimeout(() => {
            intervalRef.current = setInterval(
                () => changeBy(direction),
                REPEAT_INTERVAL_MILLISECONDS,
            );
        }, REPEAT_DELAY_MILLISECONDS);
    };

    useEffect(() => () => {
        clearTimeout(delayRef.current);
        clearInterval(intervalRef.current);
    }, []);

    return { changeBy, start, stop };
};
