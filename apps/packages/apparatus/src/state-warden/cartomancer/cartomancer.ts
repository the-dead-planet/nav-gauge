import { ComponentType } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import turfDistance from "@turf/distance";
import { point as turfPoint } from "@turf/helpers";
import { Option } from "@ui";
import { FeatureProperties, GeoJson, LngLat } from "@tinker-chest";
import { backgroundMapStyle, customRoadsMapStyle, osmMapStyle } from "./map-styles";
import { StorageKeeper } from "../../machine-ward/storage-keeper";
import { GaugeControlsType, MapLayout, OverlayComponentProps } from "./model";

interface SelectedStyle {
    id: keyof typeof Cartomancer.styles;
}

/**
 * Stores and manages the map.
 */
export class Cartomancer<TMap> {
    public static styles = {
        'background': backgroundMapStyle,
        'osm': osmMapStyle,
        'custom-roads': customRoadsMapStyle
    }

    private defaultStyleId: keyof typeof Cartomancer.styles = 'osm';

    /**
     * All available controls position options.
     */
    public static controlsPositionOptions: Option<GaugeControlsType['controlPosition']>[] = [
        { value: "top-left", label: 'Top left' },
        { value: "top-right", label: "Top right" },
        { value: "bottom-left", label: "Bottom left" },
        { value: "bottom-right", label: "Bottom right" }
    ];

    public static defaultGaugeControls: GaugeControlsType = {
        globeProjection: true,
        showZoomButtons: false,
        showCurrentZoom: true,
        showCompass: true,
        showGreenScreen: false,
        controlPosition: 'top-right',
        controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 },
        showRouteLine: true,
        showRoutePoints: true,
    }

    public static defaultMapLayout: MapLayout = {
        size: {
            type: 'full-screen',
            width: 400,
            height: 400
        },
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: '0',
        innerBorderWidth: 0,
        innerBorderColor: '#000000',
        boxShadow: '',
        innerBoxShadow: '',
    };

    /**
     * For mouse and touch events
     */
    public static interactionBuffer = 4;

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);

    private selectedStyleStorageId = 'cartomancer:map-style';
    private selectedStyleStorageSubscription: Subscription | null = null;
    public selectedStyle$: BehaviorSubject<SelectedStyle>;

    private gaugeControlsStorageId = 'cartomancer:gauge-controls';
    private gaugeControlsStorageSubscription: Subscription | null = null;
    public gaugeControls$: BehaviorSubject<GaugeControlsType>;

    private mapLayoutStorageId = 'cartomancer:map-layout';
    private mapLayoutStorageSubscription: Subscription | null = null;
    public mapLayout$: BehaviorSubject<MapLayout>;

    public constructor() {
        this.selectedStyle$ = new BehaviorSubject({ id: this.defaultStyleId });
        this.gaugeControls$ = new BehaviorSubject(Cartomancer.defaultGaugeControls);
        this.mapLayout$ = new BehaviorSubject(Cartomancer.defaultMapLayout);
    }

    public initialize = (storageKeeper: StorageKeeper) => {
        this.selectedStyleStorageSubscription = storageKeeper.synchronizeSubjectWithStorage(this.selectedStyle$, this.selectedStyleStorageId, this.cleanUpSelectedStyle)
        this.gaugeControlsStorageSubscription = storageKeeper.synchronizeSubjectWithStorage(this.gaugeControls$, this.gaugeControlsStorageId);
        this.mapLayoutStorageSubscription = storageKeeper.synchronizeSubjectWithStorage(this.mapLayout$, this.mapLayoutStorageId);
    };

    public cleanUp = () => {
        this.selectedStyleStorageSubscription?.unsubscribe();
        this.gaugeControlsStorageSubscription?.unsubscribe();
        this.mapLayoutStorageSubscription?.unsubscribe();
    };

    public bearing$ = new BehaviorSubject(0);
    public zoom$ = new BehaviorSubject(0);
    public overlays$ = new BehaviorSubject<Map<string, ComponentType<OverlayComponentProps<TMap>>>>(new Map());

    private cleanUpSelectedStyle = (state: unknown): Partial<SelectedStyle> => {
        const { id } = state as SelectedStyle;

        if (Cartomancer.styles[id]) {
            return { id };
        }

        return { id: this.defaultStyleId };
    };

    /**
     * Adds map overlay components rendered in the map area unconditionally.
     * If an overlay with a given id exists, it will be overwritten.
     */
    public addOverlay = (id: string, component: ComponentType<OverlayComponentProps<TMap>>) => {
        const nextOverlays = new Map(this.overlays$.value);
        nextOverlays.set(id, component);
        this.overlays$.next(nextOverlays);
    };

    /**
     * Removes the map overlay component with a given `id`.
     */
    public removeOverlay = (id: string) => {
        const nextOverlays = new Map(this.overlays$.value);
        nextOverlays.delete(id);
        this.overlays$.next(nextOverlays);
    };

    /**
     * Searches for the closest point to a given coordinate using the turf distance metric (Haversine formula).
     * @param lngLat Coordinates for which to find the closest feature.
     * @param geojson Route data to get feature id from.
     * @returns A tuple where the first element is the ID of the closest feature from `geojson`, and second is the feature.
     */
    public static getClosestFeature = (
        geojson: GeoJson,
        lngLat?: LngLat,
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
}
