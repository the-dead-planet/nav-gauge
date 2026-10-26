import { ReactNode } from "react";
import { AppearanceProps, ColorVariant, SizeVariant } from "../../design-system/model";
import { TooltipProps } from "../../gizmos/tooltip";

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface MenuProps extends AppearanceProps {
    /** Where the menu opens relative to its trigger. Placement may flip to stay inside the viewport. */
    placement?: MenuAnchor;
    icon?: string;
    /** Trigger and list size when size is not supplied. */
    iconSize?: SizeVariant;
    iconActiveColor?: ColorVariant;
    triggerActive?: boolean;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    triggerAccessibilityLabel?: string;
    children?: ReactNode;
}

export interface MenuItemProps extends AppearanceProps {
    isFirst?: boolean;
    closeOnPress?: boolean;
    children: ReactNode;
}
