import * as maplibregl from "maplibre-gl";
import { Cartomancer } from "@apparatus";

maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

export const createMap = () => {
    const container = document.createElement('div');
    
    return new maplibregl.Map({
        container,
        style: Cartomancer.styles['osm'].style,
        attributionControl: false,
        maxPitch: 80,
    });
};
