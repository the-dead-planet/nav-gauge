export enum FeatureStateProps {
    Highlight = 'highlight',
    Dragging = 'dragging',
}

export interface CurrentPointData {
    line: GeoJSON.GeoJSON;
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    currentPointBearing: number;
    currentPointSpeed: number;
}
