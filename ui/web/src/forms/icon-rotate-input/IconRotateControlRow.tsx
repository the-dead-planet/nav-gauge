import { FC } from "react";
import classNames from "classnames";
import { IconRotateControlRowProps } from "@ui";
import { CompanionNumberInput } from "../number-input/CompanionNumberInput";
import { StepControls } from "../step-controls";
import styles from "./icon-rotate-control-row.module.css";

export const IconRotateControlRow: FC<IconRotateControlRowProps> = ({
    value,
    onChange,
    min,
    max,
    step,
    label,
    ariaLabel,
    showNumberInput = false,
    showStepControls = false,
    stepControlsProps,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => (
    <div
        className={classNames(
            styles.row,
            showNumberInput && styles[numberInputPlacement],
        )}
    >
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
                ariaLabel={ariaLabel ?? label}
            >
                {children}
            </StepControls>
        ) : (
            children
        )}
        {showNumberInput ? (
            <CompanionNumberInput
                placement={numberInputPlacement}
                {...appearanceProps}
                value={value}
                onChange={(next) => onChange?.(next)}
                min={min}
                max={max}
                step={step}
                disabled={appearanceProps.disabled || !onChange}
                showStepControls
                ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
            />
        ) : null}
    </div>
);
