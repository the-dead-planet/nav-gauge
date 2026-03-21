import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { LayerSpecification, SourceSpecification } from "@maplibre/maplibre-gl-style-spec";
import { UpdatedData, useUpdateSourceData } from "./useUpdateSourceData";
import { useStateWarden } from "../../useStateWarden";
import { FeatureStateProps } from "../map-layers";

const DEFAULT_BUFFER = 4;

export interface MapLayerData {
    sources: { [key in string]: SourceSpecification };
    /**
     * Tuples [layer specification, before id]
     */
    layers: LayerSpecification[];
    handlers?: MapDataHandlers;
}

export interface MapLayerHandlerData {
    features: maplibregl.MapGeoJSONFeature[];
    allFeatures: maplibregl.MapGeoJSONFeature[];
    isTopRelated: boolean;
}

export interface MapDataHandlers {
    onMouseMove?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent) => void,
    onMouseDown?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => void,
    onMouseUp?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => void,
    onClick?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent) => void,
    options?: {
        /**
         * Buffer around cursor in pixels for feature detection. Defaults to 4px.
         */
        buffer?: number;
    };
}

export interface MapLayerDataUpdateParams {
    highlightIdsBySourceId?: Map<string, Set<(string | number)>>,
    updatedData?: UpdatedData;
    layerOrder?: string[];
}

/**
 * @param data Sources, layers and event handlers. When this dependency changes, layers will be removed and added again.
 * @param highlightIdsBySourceId Map of `sourceId -> featureIds` to apply highlight feature state to.
 * @param updatedData Changes to this dependency will trigger `source.setData` event (without removing the layers and sources).
 */
export const useMapLayerData = (
    map: maplibregl.Map,
    data: MapLayerData,
    {
        highlightIdsBySourceId,
        updatedData,
        layerOrder,
    }: MapLayerDataUpdateParams = {},
) => {
    const { cartomancer } = useStateWarden();

    useEffect(() => {
        const abortController = new AbortController();
        const { sources, layers, handlers } = data;
        const { buffer = DEFAULT_BUFFER } = data.handlers?.options ?? {};
        cartomancer.addSourcesAndLayers(map, abortController.signal, sources, layers, layerOrder);

        const queryFeatures = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent): {
            features: maplibregl.MapGeoJSONFeature[];
            allFeatures: maplibregl.MapGeoJSONFeature[];
            isTopRelated: boolean;
        } => {
            const layerIds = layers.map((layer) => layer.id);
            const allFeatures = map.queryRenderedFeatures([
                [event.point.x - buffer, event.point.y - buffer],
                [event.point.x + buffer, event.point.y + buffer],
            ]);

            if (allFeatures.every((feature) => !layerIds.includes(feature.layer.id))) {
                return { features: [], allFeatures: [], isTopRelated: false };
            }

            return {
                features: allFeatures.filter((feature) => layerIds.includes(feature.layer.id)),
                allFeatures,
                isTopRelated: !!allFeatures[0] && layerIds.includes(allFeatures[0].layer.id)
            };
        };

        const mouseMoveHandler = (event: maplibregl.MapMouseEvent) => {
            handlers?.onMouseMove?.(queryFeatures(event), event);
        };

        const mouseDownHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            handlers?.onMouseDown?.(queryFeatures(event), event);
        };

        const mouseUpHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            handlers?.onMouseUp?.(queryFeatures(event), event)
        };

        const clickHandler = (event: maplibregl.MapMouseEvent) => {
            handlers?.onClick?.(queryFeatures(event), event)
        };

        map.on('click', clickHandler);

        map.on('mousemove', mouseMoveHandler);

        map.on('mousedown', mouseDownHandler);
        map.on('mouseup', mouseUpHandler);

        map.on('touchstart', mouseDownHandler);
        map.on('touchend', mouseUpHandler);

        return () => {
            abortController.abort();
            
            map.off('click', clickHandler);

            map.off('mousemove', mouseMoveHandler);

            map.off('mousedown', mouseDownHandler);
            map.off('mouseup', mouseUpHandler);

            map.off('touchstart', mouseDownHandler);
            map.off('touchend', mouseUpHandler);

            cartomancer.clearLayersAndSources(map, layers, sources);
        };
    }, [map, data]);

    useUpdateSourceData(map, updatedData);

    useEffect(() => {
        if (!highlightIdsBySourceId || highlightIdsBySourceId.size === 0) {
            return;
        }
        const update = (value: boolean) => {
            for (const [sourceId, featureIds] of highlightIdsBySourceId) {
                cartomancer.updateFeatureState(map, sourceId, featureIds, FeatureStateProps.Highlight, value)
            }
        };

        update(true);

        return () => {
            update(false);
        };
    }, [highlightIdsBySourceId]);

    return null;
};
