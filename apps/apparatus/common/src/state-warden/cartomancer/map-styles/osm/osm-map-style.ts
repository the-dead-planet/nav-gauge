import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { MapStyle } from "../model";
import osmStyle from "./osm.json";

export const osmMapStyle: MapStyle = {
    label: 'OpenStreetMap',
    style: osmStyle as unknown as StyleSpecification,
    attribution: {
        text: "OpenStreetMap",
        href: "https://openstreetmap.org/copyright"
    }
};
