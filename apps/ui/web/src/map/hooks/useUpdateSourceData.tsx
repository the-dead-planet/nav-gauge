import { useEffect } from "react";

let timeout: Timer | undefined;

export interface UpdatedData {
    sourceId: string;
    data: GeoJSON.GeoJSON;
    delayMs?: number | undefined;
}

/**
 * For geojson sources.
 * @param map
 * @param updatedData Memoized data. Changes will trigger `source.setData` action.
 */
export const useUpdateSourceData = (
    map: maplibregl.Map,
    updatedData?: UpdatedData,
) => {
    useEffect(() => {
        if (!updatedData) {
            return;
        }
        const { sourceId, data, delayMs } = updatedData;
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;

        if (!source || source.type !== 'geojson') {
            return;
        }

        if (delayMs) {
            timeout = setTimeout(() => {
                source.setData(data ?? { type: 'FeatureCollection', features: [] });
            }, delayMs);
        } else {
            source.setData(data);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [map, updatedData]);
};
