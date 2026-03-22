import { imageLayerIds } from "./images-layers";
import { routeLayerIds } from "./route-layers";

export const layerOrder: string[] = [
    ...Object.values(routeLayerIds),
    ...Object.values(imageLayerIds)
];
