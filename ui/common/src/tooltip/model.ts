import { ReactNode } from "react";
import { ColorVariant, SurfaceFillVariant } from "../model";

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    placement?: TooltipPlacement;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
    delay?: number;
    maxWidth?: number;
    showConnection?: boolean;
}
