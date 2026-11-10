import { ComponentType } from "react";
import { BehaviorSubject, map as rxjsMap, Observable, Subscription } from "rxjs";
import {
    backgroundMapStyle,
    customRoadsMapStyle,
    openFreeMapBrightStyle,
    openFreeMapDarkStyle,
    openFreeMapLibertyStyle,
    openFreeMapPositronStyle,
    openFreeMapFiordStyle,
    osmMapStyle,
} from "./map-styles";
import { StorageKeeper } from "../storage-keeper";
import { CartomancerTranslationKey, GaugeControlsType, MapLayout, OverlayComponentProps } from "./model";
import { ToolsStation } from "../tools-station";
import { TranslationTable, Translatron } from "../translatron";
import * as Translations from "./translations";
import { ColorVariant, ThemeMode } from "@ui";

interface SelectedStyle {
    id: keyof typeof Cartomancer.styles;
}

/**
 * Stores and manages the map.
 */
export class Cartomancer<TMap> {
    public namespace = 'cartomancer';
    public translations: TranslationTable<CartomancerTranslationKey> = Translations;
    public translationKey = CartomancerTranslationKey;
    public map: TMap | null = null;

    public static styles = {
        'background': backgroundMapStyle,
        'open-free-map-bright': openFreeMapBrightStyle,
        'open-free-map-dark': openFreeMapDarkStyle,
        'open-free-map-fiord': openFreeMapFiordStyle,
        'open-free-map-positron': openFreeMapPositronStyle,
        'open-free-map-liberty': openFreeMapLibertyStyle,
        'osm': osmMapStyle,
        'custom-roads': customRoadsMapStyle
    }

    private defaultStyleId: keyof typeof Cartomancer.styles;

    public static defaultGaugeControls: GaugeControlsType = {
        globeProjection: true,
        showZoomButtons: true,
        showCompass: true,
        showGreenScreen: false,
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
     * For mouse and touch events, in pixels
     */
    public static interactionBufferPx = 4;

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);

    private selectedStyleStorageId = 'cartomancer:map-style';
    private selectedStyleStorageSubscription: Subscription | null = null;
    public selectedStyle$: BehaviorSubject<SelectedStyle>;
    public selectedStyleThemeMode$: Observable<ThemeMode>;

    private gaugeControlsStorageId = 'cartomancer:gauge-controls';
    private gaugeControlsStorageSubscription: Subscription | null = null;
    public gaugeControls$: BehaviorSubject<GaugeControlsType>;

    private mapLayoutStorageId = 'cartomancer:map-layout';
    private mapLayoutStorageSubscription: Subscription | null = null;
    public mapLayout$: BehaviorSubject<MapLayout>;
    public blinkingState$ = new BehaviorSubject<{ color: ColorVariant; } | null>(null);

    public constructor() {
        this.defaultStyleId = 'open-free-map-dark';
        this.selectedStyle$ = new BehaviorSubject<SelectedStyle>({ id: this.defaultStyleId });
        this.selectedStyleThemeMode$ = this.selectedStyle$.pipe(rxjsMap(({ id }) => Cartomancer.styles[id].mode));
        this.gaugeControls$ = new BehaviorSubject(Cartomancer.defaultGaugeControls);
        this.mapLayout$ = new BehaviorSubject(Cartomancer.defaultMapLayout);
    }

    public initialize = (
        storageKeeper: StorageKeeper,
        translatron: Translatron,
        _toolsStation: ToolsStation<TMap>
    ) => {
        translatron.register(this.namespace, this.translations);

        storageKeeper.synchronizeSubjectWithStorage(this.selectedStyle$, this.selectedStyleStorageId, this.cleanUpSelectedStyle)
            .then((s) => this.selectedStyleStorageSubscription = s);
        storageKeeper.synchronizeSubjectWithStorage(this.gaugeControls$, this.gaugeControlsStorageId)
            .then((s) => this.gaugeControlsStorageSubscription = s);
        storageKeeper.synchronizeSubjectWithStorage(this.mapLayout$, this.mapLayoutStorageId)
            .then((s) => this.mapLayoutStorageSubscription = s);
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

    private static EARTH_RADIUS = 6378137;

    private static metersPerPixel(latitude: number, zoom: number) {
        return (
            Math.cos((latitude * Math.PI) / 180) *
            2 *
            Math.PI *
            this.EARTH_RADIUS /
            (256 * Math.pow(2, zoom))
        );
    }

    /**
     * Converts pixel buffer to meters.
     * @param lat Latitude of the location.
     * @param zoom Current map zoom.
     * @param bufferPx Will be added to the main interaction buffer.
     * @returns 
     */
    public static getBufferInMeters(lat: number, zoom: number, bufferPx = 0) {
        return Math.round(this.metersPerPixel(lat, zoom) * (bufferPx + this.interactionBufferPx));
    }
}
