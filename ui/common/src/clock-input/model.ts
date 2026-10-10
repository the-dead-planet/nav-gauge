import { AppearanceProps, FillVariant } from "../model";
import { NumberInputPlacement } from "../number-input";

export interface ClockInputProps extends AppearanceProps<FillVariant> {
    thumbIcon?: string;
    value: number;
    /**
     * Value angle is between 0 and 360.
     * @param angle In degrees
     * @returns Formatted value
     */
    formatValue?: (angle: number) => string;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    id?: string;
    label?: string;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    numberInputPlacement?: NumberInputPlacement;
    ariaLabel?: string;
}

export interface DurationClockInputProps extends AppearanceProps<FillVariant> {
    /**
     * Total duration in milliseconds.
     */
    value: number;
    /**
     * Minimum total duration in milliseconds.
     */
    min?: number;
    step?: number;
    onChange?: (milliseconds: number) => void;
    id?: string;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    numberInputPlacement?: NumberInputPlacement;
    ariaLabel?: string;
}
