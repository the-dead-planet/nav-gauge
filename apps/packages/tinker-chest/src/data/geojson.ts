export const emptyCollection: GeoJSON.GeoJSON = {
    type: 'FeatureCollection',
    features: []
};

export interface LngLat {
    lng: number;
    lat: number;
}
