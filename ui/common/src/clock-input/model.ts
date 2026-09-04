import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface ClockInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
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
}

export interface DurationClockInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
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
