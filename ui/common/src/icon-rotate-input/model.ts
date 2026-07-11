import { ColorVariant, SizeVariant } from "../model";

export interface IconRotateInputProps {
    icon?: string;
    angle: number;
    onAngleChange?: (angle: number) => void;
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
