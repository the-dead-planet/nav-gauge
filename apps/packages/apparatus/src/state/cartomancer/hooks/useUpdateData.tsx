import { useEffect } from "react";

let timeout: Timer | undefined;

/**
 * For geojson sources.
 * @param sourceId GeoJSON source ID.
 * @param updatedData Memoized data. Changes will trigger `source.setData` action.
 */
export const useUpdateSourceData = (
    map: maplibregl.Map,
    sourceId: string,
    updatedData: GeoJSON.GeoJSON,
    delay?: number
) => {
    useEffect(() => {
        if (!sourceId) {
            return;
        }

        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (!source || source.type !== 'geojson') {
            return;
        }

        if (delay) {
            timeout = setTimeout(() => {
                source.setData(updatedData);
            }, delay);
        } else {
            source.setData(updatedData);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [map, sourceId, updatedData, delay]);
};
