import { FC } from "react";
import { SliderControlRowProps } from "@ui";
import { NumberInput } from "../number-input";
import { StepControls } from "../step-controls";
import styles from "./slider.module.css";

export const SliderControlRow: FC<SliderControlRowProps> = ({
    value,
    onChange,
    min,
    max,
    step,
    ariaLabel,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    variant,
    children,
    ...appearanceProps
}) => (
    <div className={styles["control-row"]}>
        {showStepControls ? (
            <StepControls
                {...appearanceProps}
                {...stepControlsProps}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                disabled={
                    appearanceProps.disabled || stepControlsProps?.disabled
                }
                ariaLabel={ariaLabel}
            >
                {children}
            </StepControls>
        ) : (
            children
        )}
        {showNumberInput ? (
            <div className={styles["number-input"]}>
                <NumberInput
                    {...appearanceProps}
                    variant={variant}
                    value={value}
                    onChange={(nextValue) => onChange?.(nextValue)}
                    min={min}
                    max={max}
                    step={step}
                    disabled={appearanceProps.disabled || !onChange}
                    showStepControls
                    ariaLabel={`${ariaLabel ?? "Slider"} (#)`}
                />
            </div>
        ) : null}
    </div>
);
