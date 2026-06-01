import { ComponentType, FC } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, Gear, ControlComponentProps, GearTranslationTable } from "@apparatus";
import { GeoJson, ParsingResultWithError } from "@tinker-chest";
import { RouteToolProps, RouteTimes, RouteFileInputProps, RouteFitBoundsProps } from "./model";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { Icons } from "@ui";

export abstract class RouteStoryGear<TMap, TFile extends { name?: string | null; type: string | null; }, TImageData> extends Gear<TMap> {
    public readonly id = 'route-story';

    public translations: GearTranslationTable = {
        en: {
            name: 'Route Story',
            description: 'Create a video story out of your GPS traces and image data'
        }
    }
    
    public icon = Icons.NounProject.PinCinema;

    private dataSubscription: Subscription | null = null;
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly routeTimes$ = new BehaviorSubject<RouteTimes | null>(null);
    public readonly images$ = new BehaviorSubject<MarkerImage<TImageData>[]>([]);
    public readonly progressMs$ = new BehaviorSubject(0);

    public abstract fitBounds: (map: TMap, sw: [number, number], ne: [number, number]) => void;
    public abstract fileToText: (file: TFile,) => Promise<string>;
    public abstract readImage: (file: TFile, geojson?: GeoJson) => Promise<void>;
    public abstract onCleanupStory: (data: ParsingResultWithError, images: MarkerImage<TImageData>[]) => Promise<void>;

    public engageRouteStory?: () => void;
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
    public abstract fileInputComponent: ComponentType<ControlComponentProps & RouteFileInputProps<TMap, TFile, TImageData>>;

    private routeLayerFitBoundsToolId = 'fit-bounds';
    public abstract routeLayerFitBoundsComponent: ComponentType<ToolProps<TMap> & RouteFitBoundsProps<TMap>>;

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolProps<TMap> & RouteToolProps<TMap, TFile, TImageData>>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteToolProps<TMap, TFile, TImageData>>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteToolProps<TMap, TFile, TImageData>>;

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

    public engage = () => {
        this.engageRouteStory?.();
        this.dataSubscription = this.subscribeToDataUpdates();

        this.apparatus.toolsStation.addControlComponent(
            this.fileInputControlId,
            this.wrapProps<RouteFileInputProps<TMap, TFile, TImageData>, ControlComponentProps>(this.fileInputComponent, {
                data$: this.data$,
                images$: this.images$,
                fileOperator: this.fileOperator,
            })
        );

        this.apparatus.toolsStation.addToolComponent(
            this.routeLayerFitBoundsToolId,
            'left',
            this.wrapProps<RouteFitBoundsProps<TMap>, ToolProps<TMap>>(this.routeLayerFitBoundsComponent, {
                data$: this.data$,
                onFitBounds: this.fitBoundsHandler
            })
        );
        this.apparatus.toolsStation.addToolComponent(
            this.playerToolId,
            'bottom',
            this.wrapProps<RouteToolProps<TMap, TFile, TImageData>, ToolProps<TMap>>(this.playerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
            })
        );

        this.apparatus.cartomancer.addOverlay(
            this.routeOverlayId,
            this.wrapProps<RouteToolProps<TMap, TFile, TImageData>, OverlayComponentProps<TMap>>(this.routeLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
            })
        );
        this.apparatus.cartomancer.addOverlay(
            this.imagesOverlayId,
            this.wrapProps<RouteToolProps<TMap, TFile, TImageData>, OverlayComponentProps<TMap>>(this.imagesLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
            })
        );
    };

    public disengage = () => {
        this.apparatus.cartomancer.removeOverlay(this.imagesOverlayId);
        this.apparatus.cartomancer.removeOverlay(this.routeOverlayId);
        this.apparatus.toolsStation.removeToolComponent(this.playerToolId);
        this.apparatus.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId);
        this.apparatus.toolsStation.removeControlComponent(this.fileInputControlId);
        this.dataSubscription?.unsubscribe();
        this.disengageRouteStory?.();
    };

    private fitBoundsHandler = (map: TMap, sw: [number, number], ne: [number, number]) => {
        const notificationId = 'route-fit-bounds';
        this.apparatus.signaliumBureau.removeNotice(notificationId);

        try {
            this.fitBounds(map, sw, ne);
        } catch (err) {
            this.apparatus.signaliumBureau.addNotice({
                type: 'error',
                id: notificationId,
                text: (err as Error).message ?? 'Could not fit bounds to route',
                error: err as Error,
            });
        }
    };

    public fileOperator = new FileOperator(this);
    private playerOperator = new PlayerOperator(this);
};
