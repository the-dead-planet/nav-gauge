import { ReactNode } from "react";
import { ColorVariant, LayoutOrientation, SizeVariant, SurfaceVariant } from "../model";

export interface ToggleSwitchProps {
    label?: ReactNode;
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceVariant;
    orientation?: LayoutOrientation;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
