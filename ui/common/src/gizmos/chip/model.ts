import { ReactNode } from "react";
import { SizeVariant, SurfaceVariant } from "../../design-system/model";
import { TooltipProps } from "../tooltip";
import { DesignSystemColor } from "../../design-system/model";
import { ThemeComponentColor } from "../../design-system/theme";

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
