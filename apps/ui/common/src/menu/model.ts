import { ReactNode } from "react";

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface MenuProps {
    placement?: MenuAnchor;
    children?: ReactNode;
}

export interface MenuItemProps {
    label: string;
    onPress: () => void;
}
