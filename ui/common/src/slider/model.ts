import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export interface SliderProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange?: (value: number) => void;
    active?: boolean;
    disabled?: boolean;
    id?: string;
    label?: ReactNode;
}
