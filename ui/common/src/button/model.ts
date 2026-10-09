import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";
import { ColorShade, ThemeMode } from "../theme";

export type ButtonCorners = 'square' | 'circle' | 'hexagon';

export interface ButtonProps {
    color?: ColorVariant;
    shade?: ColorShade;
    highlightColor?: ColorVariant;
    highlightShade?: ColorShade;
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
    iconRotateX?: number;
    iconRotateZ?: number;
    /**
     * If styles should always use a certain mode, instead of the dynamic theme mode.
     */
    themeMode?: ThemeMode;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
