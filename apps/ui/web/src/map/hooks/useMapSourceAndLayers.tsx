import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { UpdatedData, useUpdateSourceData } from "./useUpdateSourceData";
import { FeatureStateProps } from "@the-dead-planet/nav-gauge-apparatus/src/state-warden/cartomancer/map-layers";
import { Cartomancer } from "@the-dead-planet/nav-gauge-apparatus/src/state-warden/cartomancer/cartomancer";

export interface MapLayerData {
    sourceId: string;
    source: maplibregl.SourceSpecification;
    layers: maplibregl.LayerSpecification[];
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
export const useMapSourceAndLayers = (
    map: maplibregl.Map,
    data: MapLayerData,
    {
        highlightIdsBySourceId,
        updatedData,
        layerOrder = [],
    }: MapLayerDataUpdateParams = {},
) => {
    const addSourceAndLayers = (sourceId: string, source: maplibregl.SourceSpecification, layers: maplibregl.LayerSpecification[]) => {
        map.addSource(sourceId, source);

        for (const layer of layers) {
            map.addLayer(layer);
        }

        const existing = layerOrder.filter(id => map.getLayer(id));

        for (let i = existing.length - 1; i >= 0; i--) {
            map.moveLayer(existing[i], existing[i + 1]);
        }
    };

    function clearSourceAndLayers(sourceId: string, layers: maplibregl.LayerSpecification[]) {
        for (const el of layers) {
            const id: string = typeof el === 'string' ? el : el.id;
            if (map.getLayer(id)) {
                map.removeLayer(id);
            }
        }

        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        const { sourceId, source, layers, handlers } = data;
        const { buffer = Cartomancer.interactionBufferPx } = data.handlers?.options ?? {};

        addSourceAndLayers(sourceId, source, layers)

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

            if (allFeatures.every((feature) => feature.source !== sourceId || !layerIds.includes(feature.layer.id))) {
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

            clearSourceAndLayers(sourceId, layers);
        };
    }, [map, data]);

    useUpdateSourceData(map, updatedData);

    const updateFeatureState = (
        source: string,
        featureIds: Set<string | number>,
        property: string,
        value: boolean,
    ) => {
        for (const id of featureIds) {
            if (map.getSource(source)) {
                map.setFeatureState({ source, id: id }, { [property]: value });
            }
        }
    };

    useEffect(() => {
        if (!highlightIdsBySourceId || highlightIdsBySourceId.size === 0) {
            return;
        }
        const update = (value: boolean) => {
            for (const [sourceId, featureIds] of highlightIdsBySourceId) {
                updateFeatureState(sourceId, featureIds, FeatureStateProps.Highlight, value)
            }
        };

        update(true);

        return () => {
            update(false);
        };
    }, [highlightIdsBySourceId]);

    return null;
};
