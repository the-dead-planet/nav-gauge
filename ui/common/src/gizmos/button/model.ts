import { ReactNode } from "react";
import { AppearanceProps, ActiveGlow, SurfaceVariant, CornerVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";
import { FontType } from "../../design-system/typography";

export interface ButtonProps extends AppearanceProps<SurfaceVariant> {
    fontType?: FontType;
    /** Always-visible action text below the button's shape. */
    caption?: string;
    /** Keeps the caption on one line instead of reserving two lines. */
    captionNowrap?: boolean;
    activeGlow?: ActiveGlow;
    /**
     * Defaults to `square`; circle and hexagon are icon-only.
     */
    corners?: CornerVariant;
    iconRotateX?: number;
    iconRotateZ?: number;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
