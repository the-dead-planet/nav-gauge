import { MapStyle } from "../model";
import osmStyle from "./osm.json";

export const osmMapStyle: MapStyle = {
    label: 'OpenStreetMap',
    style: osmStyle as unknown as maplibregl.StyleSpecification,
    attribution: {
        text: "OpenStreetMap",
        href: "https://openstreetmap.org/copyright"
    }
};
