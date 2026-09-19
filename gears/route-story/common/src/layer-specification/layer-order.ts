import { imageLayerIds } from "./images-layers";
import { routeLayerIds } from "./route-layers";

export const layerOrder: string[] = [
    routeLayerIds.lineInactiveOutline,
    routeLayerIds.lineActiveOutline,
    routeLayerIds.lineInactive,
    routeLayerIds.lineActive,
    routeLayerIds.pointsInactive,
    routeLayerIds.pointsActive,
    routeLayerIds.currentPoint,
    ...Object.values(imageLayerIds)
];
