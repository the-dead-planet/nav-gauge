import { ReactNode } from "react";
import { ColorVariant, GlowStyle, LayoutOrientation, SizeVariant, SurfaceVariant } from "../model";

export interface ToggleSwitchProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceVariant;
    glowStyle?: GlowStyle;
    orientation?: LayoutOrientation;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
}
