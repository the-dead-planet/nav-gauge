import { ComponentType } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, StateWarden, Gear, ControlComponentProps, Individuator } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { RouteToolProps, RouteTimes, RouteFileInputProps, RouteFitBoundsProps } from "./model";

export abstract class RouteStoryGear extends Gear<'route-story'> {
    public readonly id = 'route-story';
    private dataSubscription: Subscription | null = null;
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly routeTimes$ = new BehaviorSubject<RouteTimes | null>(null);
    public readonly images$ = new BehaviorSubject<MarkerImage[]>([]);
    public readonly progressMs$ = new BehaviorSubject(0);

    public abstract engageRouteStory: (individuator: Individuator) => void;
    public abstract disengageRouteStory: () => void;

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
    public abstract routeLayerFitBountsComponent: ComponentType<ToolProps & RouteFitBoundsProps>;

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolProps & RouteToolProps>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps & RouteToolProps>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps & RouteToolProps>;

    public engage = (stateWarden: StateWarden, individuator: Individuator) => {
        this.engageRouteStory(individuator);
        this.dataSubscription = this.subscribeToDataUpdates();

        stateWarden.toolsStation.addControlComponent(this.fileInputControlId, (props) => (
            <this.fileInputComponent data$={this.data$} images$={this.images$} {...props} />
        ));
        stateWarden.toolsStation.addToolComponent(this.routeLayerFitBoundsToolId, 'left', (props) => (
            <this.routeLayerFitBountsComponent data$={this.data$} onFitBounds={this.handleFitBounds} {...props} />
        ));
        stateWarden.toolsStation.addToolComponent(this.playerToolId, 'bottom', (props) => (
            <this.playerComponent
                data$={this.data$}
                routeTimes$={this.routeTimes$}
                images$={this.images$}
                progressMs$={this.progressMs$}
                {...props}
            />
        ));
        stateWarden.cartomancer.addOverlay(this.routeOverlayId, (props) => (
            <this.routeLayerComponent
                data$={this.data$}
                routeTimes$={this.routeTimes$}
                images$={this.images$}
                progressMs$={this.progressMs$}
                {...props}
            />
        ));
        stateWarden.cartomancer.addOverlay(this.imagesOverlayId, (props) => (
            <this.imagesLayerComponent
                data$={this.data$}
                routeTimes$={this.routeTimes$}
                images$={this.images$}
                progressMs$={this.progressMs$}
                {...props}
            />
        ));
    };

    public disengage = (stateWarden: StateWarden) => {
        stateWarden.cartomancer.removeOverlay(this.imagesOverlayId);
        stateWarden.cartomancer.removeOverlay(this.routeOverlayId);
        stateWarden.toolsStation.removeToolComponent(this.playerToolId);
        stateWarden.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId);
        this.dataSubscription?.unsubscribe();
        this.disengageRouteStory();
    };

    private fitBoundsNotificationId = 'route-fit-bounds';

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
