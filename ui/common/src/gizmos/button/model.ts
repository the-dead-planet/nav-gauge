import { ReactNode } from "react";
import { AppearanceProps, ActiveGlow, SurfaceVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";
import { FontType } from "../../design-system/typography";

export type ButtonCorners = 'square' | 'circle' | 'hexagon';

export interface ButtonProps extends AppearanceProps<SurfaceVariant> {
    fontType?: FontType;
    activeGlow?: ActiveGlow;
    /**
     * Defaults to `square`; circle and hexagon are icon-only.
     */
    corners?: ButtonCorners;
    iconRotateX?: number;
    iconRotateZ?: number;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
