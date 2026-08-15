import { ColorVariant, SizeVariant } from "../model";

export interface IconRotateInputProps {
    icon?: string;
    value: number;
    onChange?: (value: number) => void;
    valueAdjustment?: number;
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    id?: string;
    label?: string;
}
