import { ComponentType, FC } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, StateWarden, Gear, ControlComponentProps, Individuator } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
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
    public abstract routeLayerFitBoundsComponent: ComponentType<ToolProps<TMap> & RouteFitBoundsProps>;

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
            this.wrapProps<RouteFitBoundsProps, ToolProps<TMap>>(this.routeLayerFitBoundsComponent, {
                data$: this.data$,
                onFitBounds: this.handleFitBounds
            })
        );
        stateWarden.toolsStation.addToolComponent(
            this.routeLayerFitBoundsToolId+'r',
            'right',
            this.wrapProps<RouteFitBoundsProps, ToolProps<TMap>>(this.routeLayerFitBoundsComponent, {
                data$: this.data$,
                onFitBounds: this.handleFitBounds
            })
        );
        stateWarden.toolsStation.addToolComponent(
            this.routeLayerFitBoundsToolId+'t',
            'top',
            this.wrapProps<RouteFitBoundsProps, ToolProps<TMap>>(this.routeLayerFitBoundsComponent, {
                data$: this.data$,
                onFitBounds: this.handleFitBounds
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
        stateWarden.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId+'r');
        stateWarden.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId+'t');
        stateWarden.toolsStation.removeControlComponent(this.fileInputControlId);
        this.dataSubscription?.unsubscribe();
        this.disengageRouteStory?.();
    };

    private fitBoundsNotificationId = 'route-fit-bounds';

    // TODO: Move to web
    public handleFitBounds = (
        stateWarden: StateWarden,
        map: maplibregl.Map,
        boundingBox: ParsingResultWithError['boundingBox'],
        options: {
            padding?: number;
            animate?: boolean;
        } = {}
    ) => {
        stateWarden.signaliumBureau.removeNotice(this.fitBoundsNotificationId);

        if (!boundingBox) {
            return;
        }

        const { padding = 50, animate = true } = options;

        try {
            map.fitBounds(
                [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
                { animate, padding }
            );
        } catch (err) {
            stateWarden.signaliumBureau.addNotice({
                type: 'error',
                id: this.fitBoundsNotificationId,
                text: (err as Error).message ?? 'Could not fit bounds to route',
                error: err as Error,
            })
        }
    };
};
