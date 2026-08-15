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
