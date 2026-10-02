import { ColorVariant, SizeVariant, FillVariant } from "../model";
import { NumberInputPlacement } from "../number-input";

export interface ClockInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
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
    disabled?: boolean;
    id?: string;
    label?: string;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    numberInputPlacement?: NumberInputPlacement;
    ariaLabel?: string;
}

export interface DurationClockInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
    /**
     * Total duration in milliseconds.
     */
    value: number;
    /**
     * Minimum total duration in milliseconds.
     */
    min?: number;
    onChange?: (milliseconds: number) => void;
    disabled?: boolean;
    id?: string;
}
