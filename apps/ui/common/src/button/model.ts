import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type ButtonCorners = 'square' | 'rounded' | 'circle' | 'hexagon';

export interface ButtonProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    /**
     * Defaults to `ghost`
     */
    variant?: SurfaceVariant;
    glowStyle?: GlowStyle;
    /**
     * Defaults to `sm`
     */
    size?: SizeVariant;
    corners?: ButtonCorners;
    active?: boolean;
    /**
     * If styles should always use a certain mode, instead of the dynamic theme mode.
     */
    themeMode?: boolean;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
