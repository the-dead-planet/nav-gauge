import { FC, KeyboardEvent, PointerEvent, useRef } from "react";
import { addDecimalStep, Icons, StepControlsProps, useStepRepeat } from "@ui";
import { Button } from "../../button";
import styles from './step-controls.module.css';

export const StepControls: FC<StepControlsProps> = ({
    children,
    color = 'neutral',
    variant,
    size = 'sm',
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    ariaLabel,
}) => {
    const suppressKeyboardClickRef = useRef(false);
    const decrement = addDecimalStep(value, -step);
    const increment = addDecimalStep(value, step);
    const stepRepeat = useStepRepeat({ value, onChange, step, min, max, disabled: disabled || !onChange });
    const minusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.MinusOutlined
        : Icons.NounProject.Minus;
    const plusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.PlusOutlined
        : Icons.NounProject.Plus;

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, direction: -1 | 1) => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
            event.preventDefault();
            suppressKeyboardClickRef.current = true;
            stepRepeat.start(direction);
        }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            stepRepeat.stop();
        }
    };

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, direction: -1 | 1) => {
        if (event.button === 0) {
            stepRepeat.start(direction);
        }
    };

    const handleBlur = () => {
        suppressKeyboardClickRef.current = false;
        stepRepeat.stop();
    };

    const handleClick = (detail: number, direction: -1 | 1) => {
        if (detail === 0 && !suppressKeyboardClickRef.current) {
            stepRepeat.changeBy(direction);
        }
        suppressKeyboardClickRef.current = false;
    };

    return (
        <div className={styles.container}>
            <Button
                icon={minusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (min !== undefined && decrement < min)}
                onClick={(event) => handleClick(event.detail, -1)}
                onPointerDown={(event) => handlePointerDown(event, -1)}
                onPointerUp={stepRepeat.stop}
                onPointerCancel={stepRepeat.stop}
                onPointerLeave={stepRepeat.stop}
                onKeyDown={(event) => handleKeyDown(event, -1)}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                aria-label={ariaLabel ? `${ariaLabel} (−)` : '−'}
            />
            <div className={styles.control}>{children}</div>
            <Button
                icon={plusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (max !== undefined && increment > max)}
                onClick={(event) => handleClick(event.detail, 1)}
                onPointerDown={(event) => handlePointerDown(event, 1)}
                onPointerUp={stepRepeat.stop}
                onPointerCancel={stepRepeat.stop}
                onPointerLeave={stepRepeat.stop}
                onKeyDown={(event) => handleKeyDown(event, 1)}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                aria-label={ariaLabel ? `${ariaLabel} (+)` : '+'}
            />
        </div>
    );
};
