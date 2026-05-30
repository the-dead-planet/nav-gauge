import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export type ButtonVariant = 'ghost' | 'fill' | 'outline' | 'inset';
export type ButtonCorners = 'square' | 'rounded' | 'circle';

export interface ButtonProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    /**
     * Defaults to `ghost`
     */
    variant?: ButtonVariant;
    /**
     * Defaults to `sm`
     */
    size?: SizeVariant;
    corners?: ButtonCorners;
    active?: boolean;
    children?: ReactNode;
}
