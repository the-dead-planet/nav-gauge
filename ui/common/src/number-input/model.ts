import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export type NumberInputPlacement = 'start' | 'end' | 'above' | 'below';

export interface NumberInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    label?: ReactNode;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    autoSelect?: boolean;
    ariaLabel?: string;
    unit?: string;
    showStepControls?: boolean;
}
