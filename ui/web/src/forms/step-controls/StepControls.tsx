import { FC } from "react";
import { addDecimalStep, Icons, StepControlsProps } from "@ui";
import { Button } from "../../button";
import { useStepRepeatButton } from './useStepRepeatButton';
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
    const decrement = addDecimalStep(value, -step);
    const increment = addDecimalStep(value, step);
    const getStepButtonProps = useStepRepeatButton({ value, onChange, step, min, max, disabled: disabled || !onChange });
    const minusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.MinusOutlined
        : Icons.NounProject.Minus;
    const plusIcon = variant === 'fill-translucent'
        ? Icons.NounProject.PlusOutlined
        : Icons.NounProject.Plus;

    return (
        <div className={styles.container}>
            <Button
                {...getStepButtonProps(-1)}
                icon={minusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (min !== undefined && decrement < min)}
                aria-label={ariaLabel ? `${ariaLabel} (−)` : '−'}
            />
            <div className={styles.control}>{children}</div>
            <Button
                {...getStepButtonProps(1)}
                icon={plusIcon}
                color={color}
                size={size}
                disabled={disabled || !onChange || (max !== undefined && increment > max)}
                aria-label={ariaLabel ? `${ariaLabel} (+)` : '+'}
            />
        </div>
    );
};
