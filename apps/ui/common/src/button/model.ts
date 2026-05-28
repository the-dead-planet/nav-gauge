import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export type ButtonEffect = 'color' | 'fill' | 'outline';
export type ButtonVariant = 'ghost' | 'fill' | 'outline' | 'inset';
export type ButtonCorners = 'square' | 'rounded' | 'circle';

export interface ButtonProps {
    color?: ColorVariant;
    /**
     * Defaults to `ghost`
     */
    variant?: ButtonVariant;
    highlightEffects?: ButtonEffect[];
    activeEffects?: ButtonEffect[];
    /**
     * Defaults to `sm`
     */
    size?: SizeVariant;
    corners?: ButtonCorners;
    active?: boolean;
    children?: ReactNode;
}
