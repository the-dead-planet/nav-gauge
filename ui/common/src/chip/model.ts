import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceVariant } from "../model";
import { TooltipProps } from "../tooltip";
import { DesignSystemColor, ThemeComponentColor } from "../theme";

export type ChipColor = DesignSystemColor | ThemeComponentColor;

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
