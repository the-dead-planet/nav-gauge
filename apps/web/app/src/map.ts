import { Cartomancer } from "@apparatus";
import maplibregl from "maplibre-gl";

export const createMap = () => new maplibregl.Map({
    container: document.createElement('div'),
    style: Cartomancer.styles.get('osm')!.style,
    attributionControl: false,
    maxPitch: 80,
});
