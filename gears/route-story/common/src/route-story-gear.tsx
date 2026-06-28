import { ComponentType, FC } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolPanelProps, MarkerImage, OverlayComponentProps, Gear, TranslationTable, GearTranslationKey } from "@apparatus";
import { GeoJson, ParsingResultWithError } from "@tinker-chest";
import { RouteStoryProps, RouteTimes, RouteStoryFile, RouteStoryTranslationKey, RouteStoryState } from "./model";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { Icons } from "@ui";
import * as Translations from "./translations";


export abstract class RouteStoryGear<TMap, TFile extends RouteStoryFile, TImageData> extends Gear<TMap> {
    public readonly id = 'route-story';
    public translations: TranslationTable<GearTranslationKey | RouteStoryTranslationKey> = Translations;
    public internalTranslationKey = RouteStoryTranslationKey;

    public icon = Icons.NounProject.PinCinema as unknown as string;

    private dataSubscription: Subscription | null = null;
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly state$ = new BehaviorSubject<RouteStoryState>({ showRouteLine: true, showRoutePoints: true });
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

    private routeLayerFitBoundsToolIconId = 'fit-bounds';

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolPanelProps<TMap> & RouteStoryProps<TMap, TFile, TImageData>>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteStoryProps<TMap, TFile, TImageData>>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteStoryProps<TMap, TFile, TImageData>>;

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

    private getProps = (): RouteStoryProps<TMap, TFile, TImageData> => ({
        data$: this.data$,
        state$: this.state$,
        routeTimes$: this.routeTimes$,
        images$: this.images$,
        progressMs$: this.progressMs$,
        fileOperator: this.fileOperator,
        playerOperator: this.playerOperator,
    });

    public engage = () => {
        this.engageRouteStory?.();
        this.dataSubscription = this.subscribeToDataUpdates();

        this.apparatus.toolsStation.addToolIcon(
            this.routeLayerFitBoundsToolIconId,
            {
                tooltip: { n: this.id, t: this.internalTranslationKey.FitBounds },
                placement: 'left',
                icon: Icons.NounProject.Target as unknown as string,
                onClick: (map) => {
                    const boundingBox = this.data$.value.boundingBox;
                    if (!boundingBox) {
                        return;
                    }
                    this.fitBoundsHandler(map, [boundingBox[0], boundingBox[1]], [boundingBox[2], boundingBox[3]]);
                }
            });
        this.apparatus.toolsStation.addToolPanel(
            this.playerToolId,
            {
                title: { n: this.id, t: this.internalTranslationKey.Player },
                placement: 'bottom',
                icon: Icons.NounProject.PayerConfiguration as unknown as string,
                component: this.wrapProps<RouteStoryProps<TMap, TFile, TImageData>, ToolPanelProps<TMap>>(this.playerComponent, this.getProps())
            }
        );
        this.apparatus.toolsStation.activeBottomPanelToolId$.next(this.playerToolId);

        this.apparatus.cartomancer.addOverlay(
            this.routeOverlayId,
            this.wrapProps<RouteStoryProps<TMap, TFile, TImageData>, OverlayComponentProps<TMap>>(this.routeLayerComponent, this.getProps())
        );
        this.apparatus.cartomancer.addOverlay(
            this.imagesOverlayId,
            this.wrapProps<RouteStoryProps<TMap, TFile, TImageData>, OverlayComponentProps<TMap>>(this.imagesLayerComponent, this.getProps())
        );
    };

    public disengage = () => {
        this.apparatus.cartomancer.removeOverlay(this.imagesOverlayId);
        this.apparatus.cartomancer.removeOverlay(this.routeOverlayId);
        this.apparatus.toolsStation.removeToolPanel(this.playerToolId);
        this.apparatus.toolsStation.removeToolIcon(this.routeLayerFitBoundsToolIconId);
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
