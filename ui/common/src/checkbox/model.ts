import { ReactNode } from "react";
import { ColorVariant, SizeVariant, FillVariant } from "../model";

export interface CheckboxProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: FillVariant;
    size?: SizeVariant;
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}
