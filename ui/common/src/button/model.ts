import { ReactNode } from "react";
import { AppearanceProps, InteractionGlow, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type ButtonCorners = 'square' | 'circle' | 'hexagon';

export interface ButtonProps extends AppearanceProps<SurfaceVariant> {
    interactionGlow?: InteractionGlow;
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
