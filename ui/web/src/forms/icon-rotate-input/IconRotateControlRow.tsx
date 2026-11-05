import { FC } from "react";
import classNames from "classnames";
import { getCompanionNumberInputWidth, IconRotateControlRowProps } from "@ui";
import { NumberInput } from "../number-input";
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
            <NumberInput
                width={getCompanionNumberInputWidth(numberInputPlacement)}
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
