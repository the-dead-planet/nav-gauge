import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface NumberInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    autoSelect?: boolean;
}
