import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface AngleInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    id?: string;
    label?: string;
}
