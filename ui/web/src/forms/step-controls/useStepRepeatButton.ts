import { KeyboardEvent, MouseEvent, PointerEvent, useRef } from 'react';
import { StepRepeatOptions, useStepRepeat } from '@ui';

export const useStepRepeatButton = (options: StepRepeatOptions) => {
    const suppressKeyboardClickRef = useRef(false);
    const stepRepeat = useStepRepeat(options);

    const getButtonProps = (direction: -1 | 1) => ({
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
            if (event.detail === 0 && !suppressKeyboardClickRef.current) {
                stepRepeat.changeBy(direction);
            }
            suppressKeyboardClickRef.current = false;
        },
        onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
            if (event.button === 0) {
                stepRepeat.start(direction);
            }
        },
        onPointerUp: stepRepeat.stop,
        onPointerCancel: stepRepeat.stop,
        onPointerLeave: stepRepeat.stop,
        onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
            if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                event.preventDefault();
                suppressKeyboardClickRef.current = true;
                stepRepeat.start(direction);
            }
        },
        onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                stepRepeat.stop();
            }
        },
        onBlur: () => {
            suppressKeyboardClickRef.current = false;
            stepRepeat.stop();
        },
    });

    return getButtonProps;
};
