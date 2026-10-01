import { FC } from "react";
import { addDecimalStep, Icons, StepControlsProps } from "@ui";
import { Button } from "../../button";
import styles from './step-controls.module.css';

export const StepControls: FC<StepControlsProps> = ({
    children,
    color = 'neutral',
    size = 'sm',
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
}) => {
    const decrement = addDecimalStep(value, -step);
    const increment = addDecimalStep(value, step);

    return (
        <div className={styles.container}>
            <Button
                icon={Icons.NounProject.Minus}
                color={color}
                size={size}
                disabled={disabled || !onChange || (min !== undefined && decrement < min)}
                onClick={() => onChange?.(decrement)}
                aria-label="Decrease"
            />
            <div className={styles.control}>{children}</div>
            <Button
                icon={Icons.NounProject.Plus}
                color={color}
                size={size}
                disabled={disabled || !onChange || (max !== undefined && increment > max)}
                onClick={() => onChange?.(increment)}
                aria-label="Increase"
            />
        </div>
    );
};
