import { AttributionEntry } from "../../../attribution-vault";
import { MapStyle } from "../model";

const attribution: AttributionEntry[] = [
    {
        text: "OpenFreeMap",
        shortText: "OFM",
        href: "https://openfreemap.org"
    },
    {
        text: "OpenMapTiles",
        shortText: "OMT",
        href: "https://www.openmaptiles.org"
    },
    {
        text: "OpenStreetMap",
        shortText: "OSM",
        href: "https://www.openstreetmap.org/copyright"
    }
];

export const openFreeMapPositronStyle: MapStyle = {
    label: 'Open Free Map - Positron',
    mode: 'light',
    style: 'https://tiles.openfreemap.org/styles/positron',
    attribution,
};

export const openFreeMapLibertyStyle: MapStyle = {
    label: 'Open Free Map - Liberty (3D)',
    mode: 'light',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    attribution,
};

export const openFreeMapBrightStyle: MapStyle = {
    label: 'Open Free Map - Bright',
    mode: 'light',
    style: 'https://tiles.openfreemap.org/styles/bright',
    attribution,
};

export const openFreeMapDarkStyle: MapStyle = {
    label: 'Open Free Map - Dark',
    mode: 'dark',
    style: 'https://tiles.openfreemap.org/styles/dark',
    attribution,
};

export const openFreeMapFiordStyle: MapStyle = {
    label: 'Open Free Map - Fiord',
    mode: 'dark',
    style: 'https://tiles.openfreemap.org/styles/fiord',
    attribution,
};
