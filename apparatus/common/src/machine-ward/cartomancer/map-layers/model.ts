export enum FeatureStateProps {
    Highlight = 'highlight',
    Dragging = 'dragging',
}

export interface CurrentPointData {
    simplifiedLine: GeoJSON.GeoJSON<GeoJSON.LineString>;
    line: GeoJSON.GeoJSON;
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    splitIndex: number;
    fraction: number;
}
