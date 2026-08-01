export const MAP_MIN = 200;
export const PANEL_MIN = 32;
export const PANEL_MIN_LEFT = 42;
export const DEFAULT_WIDTH = 360;
export const LEFT_ICONS_WIDTH = 102;
export const RIGHT_ICONS_WIDTH = 76;
export const TOP_TOOLS_MIN = 160;
export const BOTTOM_SECONDARY_PANEL_MIN = 32;
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
    const max = windowWidth - otherEffective - MAP_MIN;

    return Math.min(Math.max(requestedWidth, thisMin), max);
}

export function computeLayoutConstraints(
    window: { width: number; height: number },
    leftEffective: number,
    rightEffective: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
): { leftMax: number; rightMax: number; iconsReserved: number; column3Min: number; bottomSecondaryMax: number; } {
    const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
    const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
    const leftMax = window.width - rightEffective - iconsReserved - column3Min;
    const rightMax = window.width - leftEffective - iconsReserved - column3Min;
    const bottomSecondaryMax = window.height - 50 - 40 - 70 - 100;

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
): PanelLayout {
    const leftEffective = computeEffectiveWidth(leftState, PANEL_MIN_LEFT);
    const rightEffective = computeEffectiveWidth(rightState, PANEL_MIN);
    const { leftMax, rightMax, bottomSecondaryMax } = computeLayoutConstraints(window, leftEffective, rightEffective, leftIconsPresent, rightIconsPresent);

    const newLeft = leftState.isCollapsed ? prev.leftWidth : Math.min(Math.max(prev.leftWidth, PANEL_MIN_LEFT), leftMax);
    const newRight = rightState.isCollapsed ? prev.rightWidth : Math.min(Math.max(prev.rightWidth, PANEL_MIN), rightMax);
    const newBottomSecondary = bottomSecondaryState.isCollapsed ? prev.bottomSecondaryHeight : Math.min(Math.max(prev.bottomSecondaryHeight, PANEL_MIN), bottomSecondaryMax);

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
    const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
    const otherMax = windowWidth - targetWidth - iconsReserved - column3Min;
    const newOther = Math.max(Math.min(otherWidth, otherMax), otherMinWidth);

    return isLeft
        ? { leftWidth: targetWidth, rightWidth: newOther, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight }
        : { leftWidth: newOther, rightWidth: targetWidth, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight };
}
