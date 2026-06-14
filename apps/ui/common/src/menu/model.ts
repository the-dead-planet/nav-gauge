import { ReactNode } from "react";
import { ColorVariant } from "../model";

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface MenuProps {
    placement?: MenuAnchor;
    icon?: string;
    iconActiveColor?: ColorVariant;
    children?: ReactNode;
}

export interface MenuItemProps {
    key: string | number;
    closeOnPress?: boolean;
    children: ReactNode;
}
