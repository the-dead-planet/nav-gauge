import { ToolPanelPlacement } from "../tools-station";

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

export interface CompassOptions {
    center: [number, number];
    bearing: number;
    pitch: number;
}

export interface ZoomOptions {
    center: [number, number];
    zoom: number;
}

export interface DragState {
    startX: number;
    currentX: number;
    startWidth: number;
    panelMin: number;
    hasLeftIcons: boolean;
    hasRightIcons: boolean;
    hasLeftPanels: boolean;
    hasRightPanels: boolean;
}

export interface BottomSecondaryDragState {
    startY: number;
    currentY: number;
    startHeight: number;
    panelMin: number;
}