import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import turfDistance from "@turf/distance";
import { point as turfPoint } from "@turf/helpers";
import { backgroundMapStyle, customRoadsMapStyle, MapStyle, osmMapStyle } from "./map-styles";
import { Overlay } from "./model";
import { FeatureProperties, GeoJson } from "../../parsers";

/**
 * Stores and manages the map.
 */
export class Cartomancer {
    public static styles = new Map<string, MapStyle>([
        ['background', backgroundMapStyle],
        ['osm', osmMapStyle],
        ['custom-roads', customRoadsMapStyle]
    ]);

    // public map: maplibregl.Map;

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);
    private selectedStyleLocalStorageId = 'cartomancer:map-style';
    public selectedStyleId$: BehaviorSubject<string>;
    public zoom$ = new BehaviorSubject(0);

    // TODO: pass storage as arg from web/mobile
    public constructor() {
        // let styleId = localStorage.getItem(this.selectedStyleLocalStorageId);
        let styleId: string | undefined = undefined;
        if (!styleId || !Cartomancer.styles.get(styleId)) {
            styleId = 'osm';
        }
        this.selectedStyleId$ = new BehaviorSubject(styleId);

        const style = Cartomancer.styles.get(styleId) || osmMapStyle;
        // this.map = new maplibregl.Map({
        //     container: document.createElement('div'),
        //     style: style.style,
        //     attributionControl: false,
        //     maxPitch: 80,
        // });

        // this.selectedStyleId$.subscribe((id) => {
        //     localStorage.setItem(this.selectedStyleLocalStorageId, id);
        // });
    }

    public overlays$ = new BehaviorSubject<Overlay[]>([]);

    /**
     * Safely updates style and resolves when the `map.isStyleLoaded()` check resolves.
     */
    public updateStyle = async (
        map: maplibregl.Map,
        style: string | maplibregl.StyleSpecification,
        abortSignal: AbortSignal,
        onError?: (err: unknown) => void
    ) => {
        try {
            this.isStyleLoaded$.next(false);
            map.setStyle(style);
            await this.validateStyleLoaded(map, abortSignal);
            this.isStyleLoaded$.next(true);
        } catch (err) {
            onError?.(err);
        }
    };

    /**
     * Subscribes to map `idle` events and resolves when `map.isStyleLoaded()` resolves.
     */
    private validateStyleLoaded = (
        map: maplibregl.Map,
        abortSignal: AbortSignal
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const isLoadedHandler = (_event: maplibregl.MapDataEvent) => {
                if (abortSignal.aborted) {
                    map.off('idle', isLoadedHandler);
                    reject("User aborted map style validation.")
                } else
                    if (map.isStyleLoaded()) {
                        map.off('idle', isLoadedHandler);
                        resolve();
                    }
            }

            map.on('idle', isLoadedHandler);
        });
    };

    public addOverlay = (overlay: Overlay) => {
        if (this.overlays$.value.some((o) => o.id === overlay.id)) {
            throw new Error(`Overlay with id: ${overlay.id} already exists.`);
        }
        this.overlays$.next(this.overlays$.value.concat(overlay));
    };

    public removeOverlay = (id: string) => {
        this.overlays$.next(this.overlays$.value.filter((overlay) => overlay.id !== id));
    };

    /**
     * Adds sources and afterwards layers.
     */
    public addSourcesAndLayers = (
        map: maplibregl.Map,
        sources: { [key in string]: maplibregl.SourceSpecification },
        layers: maplibregl.LayerSpecification[],
        beforeId?: string,
    ) => {
        for (const [sourceId, source] of Object.entries(sources)) {
            map.addSource(sourceId, source);
        }

        for (const layer of layers) {
            map.addLayer(layer, beforeId && map.getLayer(beforeId) ? beforeId : undefined);
        }
    };

    /**
     * Removes layers with given `layerIds` and afterwards sources with given `sourceIds`.
     */
    public clearLayersAndSources(map: maplibregl.Map, layers: maplibregl.LayerSpecification[], sources: { [key: string]: maplibregl.SourceSpecification }): void;
    public clearLayersAndSources(map: maplibregl.Map, layers: string[], sources: string[]): void;
    public clearLayersAndSources(
        map: maplibregl.Map, 
        layers: maplibregl.LayerSpecification[] | string[],
        sources: { [key: string]: maplibregl.SourceSpecification } | string[]
    ): void {
        for (const el of layers) {
            const id: string = typeof el === 'string' ? el : el.id;
            if (map.getLayer(id)) {
                map.removeLayer(id);
            }
        }

        const sourceIds: string[] = Array.isArray(sources) ? sources : Object.keys(sources);
        for (const id of sourceIds) {
            if (map.getSource(id)) {
                map.removeSource(id);
            }
        }
    };

    /**
     * Searches for the closest point to a given coordinate using the turf distance metric (Haversine formula).
     * @param lngLat Coordinates for which to find the closest feature.
     * @param geojson Route data to get feature id from.
     * @returns A tuple where the first element is the ID of the closest feature from `geojson`, and second is the feature.
     */
    public static getClosestFeature = (
        geojson: GeoJson,
        lngLat?: maplibregl.LngLat,
    ): [number, GeoJSON.Feature<GeoJSON.Point, FeatureProperties>] => {
        if (!lngLat) {
            return [0, geojson.features[0]];
        }
        const [feature] = geojson.features.reduce<[GeoJSON.Feature<GeoJSON.Point, FeatureProperties>, number]>((acc, val) => {
            const from = turfPoint([lngLat.lng, lngLat.lat]);
            const to = turfPoint(val.geometry.coordinates);
            const distance = turfDistance(from, to, { units: 'meters' });

            return distance < acc[1] ? [val, distance] : acc;
        }, [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                id: -1,
                time: new Date().toISOString()
            }
        }, Infinity]);

        return [feature.properties.id, feature];
    };

    public updateFeatureState = (
        map: maplibregl.Map,
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
}
