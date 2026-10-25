import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";
import { FontType } from "../../design-system/typography";

export interface ChipProps {
    fontType?: FontType;
    /**
     * Defaults to `neutral`
     */
    color?: ColorVariant;
    /**
     * Defaults to `sm`
     */
    size?: SizeVariant;
    /**
     * Defaults to `ghost`
     */
    variant?: SurfaceVariant;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    /**
     * Defaults to `fill-inverse`
     */
    tooltipVariant?: TooltipProps['variant'];
    showTooltipConnection?: boolean;
    children?: ReactNode;
}
