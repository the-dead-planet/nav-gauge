import { ReactElement, ReactNode } from "react";
import { ColorVariant, SurfaceFillVariant } from "../model";

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
    content: ReactNode;
    children: ReactElement;
    placement?: TooltipPlacement;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
    maxWidth?: number;
    showConnection?: boolean;
}

export interface TooltipRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
