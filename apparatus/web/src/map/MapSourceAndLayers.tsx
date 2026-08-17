import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { MapLayerData, MapLayerDataUpdateParams, useMapSourceAndLayers } from "./hooks";

interface Props {
    map: maplibregl.Map;
    mapLayerData: MapLayerData;
}

export const MapSourceAndLayers: FC<Props & MapLayerDataUpdateParams> = ({
    map,
    mapLayerData,
    highlightIdsBySourceId,
    updatedData,
    layerOrder,
}) => {
    useMapSourceAndLayers(map, mapLayerData, {
        highlightIdsBySourceId,
        updatedData,
        layerOrder,
    });

    return null;
};
