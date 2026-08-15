import { AttributionEntry } from "../../../attribution-vault";
import { MapStyle } from "../model";

const attribution: AttributionEntry[] = [
    {
        text: "OpenFreeMap",
        href: "https://openfreemap.org"
    },
    {
        text: "OpenMapTiles",
        href: "https://www.openmaptiles.org"
    },
    {
        text: "OpenStreetMap",
        href: "https://www.openstreetmap.org/copyright"
    }
];

export const openFreeMapPositronStyle: MapStyle = {
    label: 'Open Free Map - Positron',
    style: 'https://tiles.openfreemap.org/styles/positron',
    attribution,
};

export const openFreeMapLibertyStyle: MapStyle = {
    label: 'Open Free Map - Liberty (3D)',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    attribution,
};

export const openFreeMapBrightStyle: MapStyle = {
    label: 'Open Free Map - Bright',
    style: 'https://tiles.openfreemap.org/styles/bright',
    attribution,
};

export const openFreeMapDarkStyle: MapStyle = {
    label: 'Open Free Map - Dark',
    style: 'https://tiles.openfreemap.org/styles/dark',
    attribution,
};

export const openFreeMapFiordStyle: MapStyle = {
    label: 'Open Free Map - Fiord',
    style: 'https://tiles.openfreemap.org/styles/fiord',
    attribution,
};
