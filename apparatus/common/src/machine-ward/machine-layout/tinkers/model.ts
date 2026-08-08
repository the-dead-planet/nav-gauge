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
