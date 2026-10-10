import { ReactNode } from "react";
import { AppearanceProps, GlowStyle, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type ButtonCorners = 'square' | 'circle' | 'hexagon';

export interface ButtonProps extends AppearanceProps<SurfaceVariant> {
    glowStyle?: GlowStyle;
    /**
     * Defaults to `sm`
     */
    corners?: ButtonCorners;
    iconRotateX?: number;
    iconRotateZ?: number;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
