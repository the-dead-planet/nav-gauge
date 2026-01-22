import { MapStyle } from "../model";
import customRoadsStyle from "./custom-roads.json";

export const customRoadsMapStyle: MapStyle = {
    label: 'Custom Paris roads (sample test)',
    style: customRoadsStyle as maplibregl.StyleSpecification,
    attribution: {
        text: "Overture Maps",
        href: "https://docs.overturemaps.org/attribution"
    }
};
