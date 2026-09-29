import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { ThemeMode } from '@ui';
import { AttributionEntry } from "../../attribution-vault";

export interface MapStyle {
    label: string;
    mode: ThemeMode;
    style: string | StyleSpecification;
    attribution?: AttributionEntry | AttributionEntry[];
}
