import { ReactElement, ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
    content: ReactNode;
    children: ReactElement;
    placement?: TooltipPlacement;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
    size?: SizeVariant;
    maxWidth?: number;
    showConnection?: boolean;
}

export interface TooltipRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
