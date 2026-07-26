export const MAP_MIN = 200;
export const PANEL_MIN = 32;
export const PANEL_MIN_LEFT = 42;
export const DEFAULT_WIDTH = 360;
export const LEFT_ICONS_WIDTH = 102;
export const RIGHT_ICONS_WIDTH = 76;
export const TOP_TOOLS_MIN = 160;

export interface PanelLayout {
    leftWidth: number;
    rightWidth: number;
}

export interface PanelState {
    hasToolPanels: boolean;
    isCollapsed: boolean;
    storedWidth: number;
}

export function computeEffectiveWidth(state: PanelState, minWidth: number): number {
    if (!state.hasToolPanels) {
        return 0;
    }

    if (state.isCollapsed) {
        return minWidth;
    }

    return state.storedWidth;
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
    windowWidth: number,
    leftEffective: number,
    rightEffective: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
): { leftMax: number; rightMax: number; iconsReserved: number; column3Min: number } {
    const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
    const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
    const leftMax = windowWidth - rightEffective - iconsReserved - column3Min;
    const rightMax = windowWidth - leftEffective - iconsReserved - column3Min;
    return { leftMax, rightMax, iconsReserved, column3Min };
}

export function clampPanelLayout(
    prev: PanelLayout,
    leftState: PanelState,
    rightState: PanelState,
    windowWidth: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
): PanelLayout {
    const leftEffective = computeEffectiveWidth(leftState, PANEL_MIN_LEFT);
    const rightEffective = computeEffectiveWidth(rightState, PANEL_MIN);
    const { leftMax, rightMax } = computeLayoutConstraints(windowWidth, leftEffective, rightEffective, leftIconsPresent, rightIconsPresent);

    const newLeft = leftState.isCollapsed ? prev.leftWidth : Math.min(Math.max(prev.leftWidth, PANEL_MIN_LEFT), leftMax);
    const newRight = rightState.isCollapsed ? prev.rightWidth : Math.min(Math.max(prev.rightWidth, PANEL_MIN), rightMax);

    if (newLeft === prev.leftWidth && newRight === prev.rightWidth) {
        return prev;
    }

    return { leftWidth: newLeft, rightWidth: newRight };
}

export function calculateExpandToDefault(
    targetWidth: number,
    otherWidth: number,
    otherMinWidth: number,
    windowWidth: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
    isLeft: boolean,
): PanelLayout {
    const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
    const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
    const otherMax = windowWidth - targetWidth - iconsReserved - column3Min;
    const newOther = Math.max(Math.min(otherWidth, otherMax), otherMinWidth);
    return isLeft
        ? { leftWidth: targetWidth, rightWidth: newOther }
        : { leftWidth: newOther, rightWidth: targetWidth };
}
