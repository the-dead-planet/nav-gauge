import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface MenuProps {
    color?: ColorVariant;
    placement?: MenuAnchor;
    icon?: string;
    iconSize?: SizeVariant;
    iconActiveColor?: ColorVariant;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    children?: ReactNode;
}

export interface MenuItemProps {
    key: string | number;
    isFirst?: boolean;
    closeOnPress?: boolean;
    children: ReactNode;
}
