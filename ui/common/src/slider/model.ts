import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface SliderProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange?: (value: number) => void;
    active?: boolean;
    disabled?: boolean;
    id?: string;
    label?: ReactNode;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    ariaLabel?: string;
}
