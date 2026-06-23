import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { MapStyle } from "../model";
import backgroundStyle from "./background.json";

export const backgroundMapStyle: MapStyle = {
    label: 'Background',
    style: backgroundStyle as unknown as StyleSpecification
};
