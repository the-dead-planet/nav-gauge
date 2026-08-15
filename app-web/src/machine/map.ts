import maplibregl from "maplibre-gl";
import { Cartomancer } from "@apparatus";

export const createMap = () => {
    const container = document.createElement('div');
    
    return new maplibregl.Map({
        container,
        style: Cartomancer.styles['osm'].style,
        attributionControl: {
            compact: false,
        },
        maxPitch: 80,
    });
};
