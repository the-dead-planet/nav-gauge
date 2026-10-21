import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";

export interface ChipProps {
    /**
     * Defaults to `neutral`
     */
    color?: ColorVariant;
    /**
     * Defaults to `sm`
     */
    size?: SizeVariant;
    /**
     * Defaults to `fill`
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
