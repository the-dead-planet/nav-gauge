import { ReactElement, ReactNode } from "react";
import { ColorVariant, SizeVariant, FillVariant } from "../model";

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
    content: ReactNode;
    children: ReactElement;
    placement?: TooltipPlacement;
    color?: ColorVariant;
    variant?: FillVariant;
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
