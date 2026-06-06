import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export type ButtonVariant = 'ghost' | 'fill' | 'outline' | 'inset';
export type ButtonCorners = 'square' | 'rounded' | 'circle' | 'hexagon';

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
    /**
     * If styles should always use a certain mode, instead of the dynamic theme mode.
     */
    mode?: boolean;
    children?: ReactNode;
}
