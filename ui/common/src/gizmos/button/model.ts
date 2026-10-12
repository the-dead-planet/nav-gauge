import { ReactNode } from "react";
import { AppearanceProps, ActiveGlow, SurfaceVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";

export type ButtonCorners = 'square' | 'circle' | 'hexagon';

export interface ButtonProps extends AppearanceProps<SurfaceVariant> {
    activeGlow?: ActiveGlow;
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
