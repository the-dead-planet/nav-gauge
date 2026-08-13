import { ObservedToolPanel, ToolbarSizeRef, ToolPanelPlacement, ToolsStation } from "../../tools-station";
import { PanelLayout, PanelState } from "../model";

export const LAYOUT_MINS = {
    tools: {
        top: 160,
    },
    panels: {
        left: 42,
        right: 32,
        bottomSecondary: 24,
    },
    remainingArea: {
        width: 200,
        height: 100,
    }
};

export const LAYOUT_DEFAULTS = {
    panels: {
        left: 360,
        right: 360,
        bottomSecondary: 300,
    },
    icons: {
        left: 102,
        right: 76,
    }
};

export const PANEL_HEADER_CURVE_SIZES = {
    size: 28,
    onlyLeftPanelRightSpacer: 110,
    bothOrNoPanelsRightSpacer: 100,
    leftSpacer: 140,
};

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
    const max = windowWidth - otherEffective - LAYOUT_MINS.remainingArea.width;

    return Math.min(Math.max(requestedWidth, thisMin), max);
}

export function computeLayoutConstraints(
    window: { width: number; height: number },
    leftEffective: number,
    rightEffective: number,
    leftIconsPresent: boolean,
    rightIconsPresent: boolean,
    reservedHeight: number,
): { leftMax: number; rightMax: number; iconsReserved: number; column3Min: number; bottomSecondaryMax: number; } {
    const iconsReserved = (leftIconsPresent ? LAYOUT_DEFAULTS.icons.left : 0) + (rightIconsPresent ? LAYOUT_DEFAULTS.icons.right : 0);
    const column3Min = Math.max(LAYOUT_MINS.tools.top, LAYOUT_MINS.remainingArea.width);
    const leftMax = window.width - rightEffective - iconsReserved - column3Min;
    const rightMax = window.width - leftEffective - iconsReserved - column3Min;
    const bottomSecondaryMax = window.height - LAYOUT_MINS.remainingArea.height - reservedHeight;

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
    reservedHeight: number,
): PanelLayout {
    const leftEffective = computeEffectiveWidth(leftState, LAYOUT_MINS.panels.left);
    const rightEffective = computeEffectiveWidth(rightState, LAYOUT_MINS.panels.right);
    const { leftMax, rightMax, bottomSecondaryMax } = computeLayoutConstraints(window, leftEffective, rightEffective, leftIconsPresent, rightIconsPresent, reservedHeight);

    const newLeft = leftState.isCollapsed ? prev.leftWidth : Math.min(Math.max(prev.leftWidth, LAYOUT_MINS.panels.left), leftMax);
    const newRight = rightState.isCollapsed ? prev.rightWidth : Math.min(Math.max(prev.rightWidth, LAYOUT_MINS.panels.right), rightMax);
    const newBottomSecondary = bottomSecondaryState.isCollapsed ? prev.bottomSecondaryHeight : Math.min(Math.max(prev.bottomSecondaryHeight, LAYOUT_MINS.panels.right), bottomSecondaryMax);

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
    const iconsReserved = (leftIconsPresent ? LAYOUT_DEFAULTS.icons.left : 0) + (rightIconsPresent ? LAYOUT_DEFAULTS.icons.right : 0);
    const column3Min = Math.max(LAYOUT_MINS.tools.top, LAYOUT_MINS.remainingArea.width);
    const otherMax = windowWidth - targetWidth - iconsReserved - column3Min;
    const newOther = Math.max(Math.min(otherWidth, otherMax), otherMinWidth);

    return isLeft
        ? { leftWidth: targetWidth, rightWidth: newOther, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight }
        : { leftWidth: newOther, rightWidth: targetWidth, bottomSecondaryHeight: prevLayout.bottomSecondaryHeight };
}

export const assignSideToolPanelRef = <TMap>(
    placement: ToolPanelPlacement,
    toolsStation: ToolsStation<TMap>,
) => (instance: ToolbarSizeRef['current']) => {
    switch (placement) {
        case "left":
            toolsStation.leftToolPanelSizeRef.current = instance;
            break;
        case "right":
            toolsStation.rightToolPanelSizeRef.current = instance;
            break;
    }
};

export const assignBottomToolPanelRef = <TMap>(
    toolsStation: ToolsStation<TMap>,
) => (instance: ToolbarSizeRef['current']) => {
    toolsStation.bottomToolPanelSizeRef.current = instance;
};

export const swapSideToolPanelPlacement = <TMap>(
    toolPanel: ObservedToolPanel<unknown>,
    toolsStation: ToolsStation<TMap>
) => () => {
    if (toolPanel.placement === 'right') {
        toolsStation.updateToolPanelPlacement(toolPanel.id, 'left');
        toolsStation.activeLeftPanelToolId$.next(toolPanel.id);
    } else {
        toolsStation.updateToolPanelPlacement(toolPanel.id, 'right');
        toolsStation.activeRightPanelToolId$.next(toolPanel.id);
    }
};
