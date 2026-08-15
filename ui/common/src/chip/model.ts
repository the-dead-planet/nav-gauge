import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type ChipColor = ColorVariant | 'warning' | 'success' | 'error' | 'info';

export interface ChipProps {
    /**
     * Defaults to `warning`
     */
    color?: ChipColor;
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
