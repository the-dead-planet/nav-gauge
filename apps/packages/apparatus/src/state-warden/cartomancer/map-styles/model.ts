import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { AttributionEntry } from "../../attribution-vault";

export interface MapStyle {
    label: string;
    style: string | StyleSpecification;
    attribution?: AttributionEntry;
}
