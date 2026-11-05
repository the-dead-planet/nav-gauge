import { FC } from "react";
import classNames from "classnames";
import { ClockControlRowProps, getClockNumberInputProps } from "@ui";
import { ClockDurationNumberInputs } from "./ClockDurationNumberInputs";
import { CompanionNumberInput } from "../number-input/CompanionNumberInput";
import { StepControls } from "../step-controls";
import styles from "./clock-input.module.css";

export const ClockControlRow: FC<ClockControlRowProps> = ({
    mode,
    value,
    min,
    max,
    step,
    onChange,
    label,
    ariaLabel,
    showNumberInput = false,
    numberInputScale,
    numberInputUnit,
    showStepControls = false,
    stepControlsProps,
    variant,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => {
    const duration = mode === "duration";
    const numberInput = getClockNumberInputProps({
        value,
        min,
        max,
        step,
        onChange,
        numberInputScale,
        numberInputUnit,
    });
    return (
        <div
            className={classNames(
                styles["control-row"],
                showNumberInput &&
                    styles[`number-input-${numberInputPlacement}`],
            )}
        >
            {showStepControls ? (
                <StepControls
                    {...appearanceProps}
                    {...stepControlsProps}
                    value={value}
                    min={min}
                    max={duration ? undefined : max}
                    step={step}
                    onChange={onChange}
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
                duration ? (
                    <ClockDurationNumberInputs
                        {...appearanceProps}
                        variant={variant}
                        value={value}
                        min={min}
                        onChange={onChange}
                        ariaLabel={ariaLabel}
                        numberInputPlacement={numberInputPlacement}
                    />
                ) : (
                    <CompanionNumberInput
                        placement={numberInputPlacement}
                        {...appearanceProps}
                        variant={variant}
                        {...numberInput}
                        disabled={appearanceProps.disabled || !onChange}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                    />
                )
            ) : null}
        </div>
    );
};
