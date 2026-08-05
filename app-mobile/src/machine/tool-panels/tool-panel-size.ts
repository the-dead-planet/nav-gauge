export const MIN_REMAINING_MAIN_AREA = { width: 200, height: 100 };
export const PANEL_MIN = { left: 42, right: 32, bottomSecondary: 24 };
export const DEFAULT_WIDTH = 360;
export const LEFT_ICONS_WIDTH = 102;
export const RIGHT_ICONS_WIDTH = 76;
export const TOP_TOOLS_MIN = 160;
export const DEFAULT_BOTTOM_SECONDARY_HEIGHT = 300;

export interface PanelLayout {
    leftWidth: number;
    rightWidth: number;
    bottomSecondaryHeight: number;
}

export interface PanelState {
    hasToolPanels: boolean;
    isCollapsed: boolean;
    storedSize: number;
}

export function computeEffectiveWidth(state: PanelState, minWidth: number): number {
    if (!state.hasToolPanels) {
        return 0;
    }
    if (state.isCollapsed) {
        return minWidth;
    }

    return state.storedSize;
}

export function clampPanelWidth(
    requestedWidth: number,
    thisMin: number,
    otherEffective: number,
    windowWidth: number,
): number {
    const max = windowWidth - otherEffective - MIN_REMAINING_MAIN_AREA.width;

    return Math.min(Math.max(requestedWidth, thisMin), max);
}

export function computeLayoutConstraints(
    window: { width: number; height: number },
    leftEffective: number,
    rightEffective: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
    reservedChromeHeight: number,
): { leftMax: number; rightMax: number; iconsReserved: number; column3Min: number; bottomSecondaryMax: number; } {
    const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
    const column3Min = Math.max(TOP_TOOLS_MIN, MIN_REMAINING_MAIN_AREA.width);
    const leftMax = window.width - rightEffective - iconsReserved - column3Min;
    const rightMax = window.width - leftEffective - iconsReserved - column3Min;
    const bottomSecondaryMax = window.height - MIN_REMAINING_MAIN_AREA.height - reservedChromeHeight;

    return {
        leftMax,
        rightMax,
        iconsReserved,
        column3Min,
        bottomSecondaryMax,
    };
}

export function clampPanelLayout(
    prev: PanelLayout,
    leftState: PanelState,
    rightState: PanelState,
    bottomSecondaryState: PanelState,
    window: { width: number; height: number },
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
    reservedChromeHeight: number,
): PanelLayout {
    const leftEffective = computeEffectiveWidth(leftState, PANEL_MIN.left);
    const rightEffective = computeEffectiveWidth(rightState, PANEL_MIN.right);
    const { leftMax, rightMax, bottomSecondaryMax } = computeLayoutConstraints(window, leftEffective, rightEffective, leftIconsPresent, rightIconsPresent, reservedChromeHeight);

    const newLeft = leftState.isCollapsed ? prev.leftWidth : Math.min(Math.max(prev.leftWidth, PANEL_MIN.left), leftMax);
    const newRight = rightState.isCollapsed ? prev.rightWidth : Math.min(Math.max(prev.rightWidth, PANEL_MIN.right), rightMax);
    const newBottomSecondary = bottomSecondaryState.isCollapsed ? prev.bottomSecondaryHeight : Math.min(Math.max(prev.bottomSecondaryHeight, PANEL_MIN.right), bottomSecondaryMax);

    if (newLeft === prev.leftWidth && newRight === prev.rightWidth && newBottomSecondary === prev.bottomSecondaryHeight) {
        return prev;
    }

    return {
        leftWidth: newLeft,
        rightWidth: newRight,
        bottomSecondaryHeight: newBottomSecondary,
    };
}

export function calculateExpandToDefault(
    targetWidth: number,
    otherWidth: number,
    otherMinWidth: number,
    windowWidth: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
    isLeft: boolean,
    prevLayout: PanelLayout,
): PanelLayout {
    const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
    const column3Min = Math.max(TOP_TOOLS_MIN, MIN_REMAINING_MAIN_AREA.width);
    const otherMax = windowWidth - targetWidth - iconsReserved - column3Min;
    const newOther = Math.max(Math.min(otherWidth, otherMax), otherMinWidth);

    return isLeft
        ? { leftWidth: targetWidth, rightWidth: newOther, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight }
        : { leftWidth: newOther, rightWidth: targetWidth, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight };
}
