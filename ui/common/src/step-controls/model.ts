import { ReactNode } from "react";
import { ColorVariant, FillVariant, SizeVariant } from "../model";

export interface StepControlsProps {
    children: ReactNode;
    color?: ColorVariant;
    variant?: FillVariant;
    size?: SizeVariant;
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    ariaLabel?: string;
}
