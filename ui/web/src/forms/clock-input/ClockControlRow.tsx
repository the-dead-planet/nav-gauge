import { FC } from "react";
import classNames from "classnames";
import { ClockControlRowProps } from "@ui";
import { ClockDurationNumberInputs } from "./ClockDurationNumberInputs";
import { NumberInput } from "../number-input";
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
    showStepControls = false,
    numberInputPlacement = "end",
    children,
    ...appearanceProps
}) => {
    const duration = mode === "duration";
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
                    color={appearanceProps.color}
                    size={appearanceProps.size}
                    variant={appearanceProps.variant}
                    value={value}
                    min={min}
                    max={duration ? undefined : max}
                    step={step}
                    onChange={onChange}
                    disabled={appearanceProps.disabled}
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
                        value={value}
                        min={min}
                        onChange={onChange}
                        ariaLabel={ariaLabel}
                    />
                ) : (
                    <NumberInput
                        {...appearanceProps}
                        value={value}
                        className={styles["number-input"]}
                        onChange={(next) => onChange?.(next)}
                        min={min}
                        max={max}
                        step={step}
                        disabled={appearanceProps.disabled || !onChange}
                        showStepControls
                        ariaLabel={`${ariaLabel ?? label ?? "Angle"} (#)`}
                    />
                )
            ) : null}
        </div>
    );
};
