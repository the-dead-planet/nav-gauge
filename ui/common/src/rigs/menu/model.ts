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

export type MenuItemLinkType = 'internal' | 'external';

export interface MenuProps extends AppearanceProps {
    /** Appearance variant of the trigger; the popup surface is always fill-inverse. */
    variant?: AppearanceProps['variant'];
    /** Where the menu opens relative to its trigger. Placement may flip to stay inside the viewport. */
    placement?: MenuAnchor;
    icon?: string;
    /** Trigger and list size when size is not supplied. */
    iconSize?: SizeVariant;
    /** Overrides the trigger highlight palette without changing menu item colors. */
    iconActiveColor?: ColorVariant;
    triggerActive?: boolean;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    triggerAccessibilityLabel?: string;
    children?: ReactNode;
}

export interface MenuItemProps extends Omit<AppearanceProps, 'variant'> {
    /** Navigation indicator; web anchors infer it from href and target when omitted. */
    linkType?: MenuItemLinkType;
    /** Persistent selection; hover and press still receive their own feedback. */
    selected?: boolean;
    isFirst?: boolean;
    closeOnPress?: boolean;
    children: ReactNode;
}
