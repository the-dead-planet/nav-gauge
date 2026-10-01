import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export interface StepControlsProps {
    children: ReactNode;
    color?: ColorVariant;
    size?: SizeVariant;
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}
