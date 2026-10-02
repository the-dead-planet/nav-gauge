import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface CheckboxProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: SurfaceFillVariant;
    size?: SizeVariant;
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}
