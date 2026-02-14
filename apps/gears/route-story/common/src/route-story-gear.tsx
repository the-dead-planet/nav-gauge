import { ComponentType, FC } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, StateWarden, Gear, ControlComponentProps, Individuator, parsers, FileToGeoJSONParser } from "@apparatus";
import { GeoJson, ParsingResultWithError } from "@tinker-chest";
import { RouteToolProps, RouteTimes, RouteFileInputProps, RouteFitBoundsProps } from "./model";

export abstract class RouteStoryGear<TMap> extends Gear<TMap, 'route-story'> {
    public readonly id = 'route-story';
    private dataSubscription: Subscription | null = null;
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly routeTimes$ = new BehaviorSubject<RouteTimes | null>(null);
    public readonly images$ = new BehaviorSubject<MarkerImage[]>([]);
    public readonly progressMs$ = new BehaviorSubject(0);

    public engageRouteStory?: (individuator: Individuator) => void;
    public disengageRouteStory?: () => void;

    private subscribeToDataUpdates = (): Subscription => {
        return this.data$.subscribe(({ geojson }) => {
            this.progressMs$.next(0);

            if (!geojson?.features[0]) {
                this.routeTimes$.next(null);

                return;
            }

            const startTime = geojson.features[0].properties.time;
            const endTime = geojson.features.slice(-1)[0]?.properties.time;
            const startTimeEpoch = new Date(startTime).valueOf();
            const endTimeEpoch = new Date(endTime).valueOf();

            this.routeTimes$.next({
                startTime,
                endTime,
                startTimeEpoch,
                endTimeEpoch,
                duration: endTimeEpoch - startTimeEpoch
            });
        });
    };

    private fileInputControlId = 'file-input';
    public abstract fileInputComponent: ComponentType<ControlComponentProps & RouteFileInputProps>;

    private routeLayerFitBoundsToolId = 'fit-bounds';
    public abstract routeLayerFitBoundsComponent: ComponentType<ToolProps<TMap> & RouteFitBoundsProps<TMap>>;

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolProps<TMap> & RouteToolProps>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteToolProps>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteToolProps>;

    /**
     * Wrapper to avoid binding issues in react native if components are wrapped in arg list.
     */
    private wrapProps<TProps extends {}, TToolProps extends {}>(
        Component: ComponentType<TToolProps & TProps>,
        props: TProps
    ): FC<TToolProps> {
        return (toolProps: TToolProps) => (
            <Component {...props} {...toolProps} />
        );
    }

    public engage = (stateWarden: StateWarden<TMap>, individuator: Individuator) => {
        this.engageRouteStory?.(individuator);
        this.dataSubscription = this.subscribeToDataUpdates();

        stateWarden.toolsStation.addControlComponent(
            this.fileInputControlId,
            this.wrapProps<RouteFileInputProps, ControlComponentProps>(this.fileInputComponent, {
                data$: this.data$,
                images$: this.images$
            })
        );

        stateWarden.toolsStation.addToolComponent(
            this.routeLayerFitBoundsToolId,
            'left',
            this.wrapProps<RouteFitBoundsProps<TMap>, ToolProps<TMap>>(this.routeLayerFitBoundsComponent, {
                data$: this.data$,
                onFitBounds: this.fitBoundsHandler
            })
        );
        stateWarden.toolsStation.addToolComponent(
            this.playerToolId,
            'bottom',
            this.wrapProps<RouteToolProps, ToolProps<TMap>>(this.playerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$
            })
        );

        stateWarden.cartomancer.addOverlay(
            this.routeOverlayId,
            this.wrapProps<RouteToolProps, OverlayComponentProps<TMap>>(this.routeLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$
            })
        );
        stateWarden.cartomancer.addOverlay(
            this.imagesOverlayId,
            this.wrapProps<RouteToolProps, OverlayComponentProps<TMap>>(this.imagesLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$
            })
        );
    };

    public disengage = (stateWarden: StateWarden<TMap>) => {
        stateWarden.cartomancer.removeOverlay(this.imagesOverlayId);
        stateWarden.cartomancer.removeOverlay(this.routeOverlayId);
        stateWarden.toolsStation.removeToolComponent(this.playerToolId);
        stateWarden.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId);
        stateWarden.toolsStation.removeControlComponent(this.fileInputControlId);
        this.dataSubscription?.unsubscribe();
        this.disengageRouteStory?.();
    };

    private fitBoundsHandler = (
        stateWarden: StateWarden,
        handler: () => void
    ) => {
        const notificationId = 'route-fit-bounds';
        stateWarden.signaliumBureau.removeNotice(notificationId);

        try {
            handler();
        } catch (err) {
            stateWarden.signaliumBureau.addNotice({
                type: 'error',
                id: notificationId,
                text: (err as Error).message ?? 'Could not fit bounds to route',
                error: err as Error,
            })
        }
    };

    public static async uploadFile<TFile extends { name?: string | null; type: string | null; }>(
        files: TFile[],
        geojson: GeoJson | undefined,
        getText: (file: TFile) => Promise<string>,
        onError: (error: Error) => void,
        onDataChange: (data: ParsingResultWithError) => void,
        readImage: (file: TFile, geojson?: GeoJson) => void,
    ) {
        if (files.length === 0) {
            return;
        }
        let currentGeojson: GeoJson | undefined = geojson;
        let geojsonFile: TFile | undefined = undefined;
        let imageFiles: TFile[] = [];
        const geoExtensions = [...parsers.values()].flatMap((p) => p.acceptedFileExtensions);

        for (const file of files) {
            if (!file.name) {
                continue;
            }
            if (file.type?.includes('image')) {
                imageFiles.push(file);
            } else if (geoExtensions.some((ext) => file.name!.endsWith(ext))) {
                geojsonFile = file;
            }
        }

        if (geojsonFile) {
            onDataChange({});
            const text = await getText(geojsonFile).catch(onError) ?? '';
            const result = await parsers
                .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name!))
                ?.parse(text);
            onDataChange(result ?? { error: new Error('No parser found for file.') });
            currentGeojson = result?.geojson
        }

        imageFiles.forEach((file) => readImage(file, currentGeojson));
    }
};
