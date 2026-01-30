import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, StateWarden, Gear } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { RouteTimes } from "./model";

export abstract class RouteStoryGear extends Gear<'route-story'> {
    public readonly id = 'route-story';
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly routeTimes$ = new BehaviorSubject<RouteTimes | null>(null);
    public readonly images$ = new BehaviorSubject<MarkerImage[]>([]);
    public readonly progressMs$ = new BehaviorSubject(0);

    public constructor(stateWarden: StateWarden) {
        super(stateWarden);
        this.setUpDataUpdates();
    }

    private setUpDataUpdates = () => {
        this.data$.subscribe(({ geojson }) => {
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
    public abstract fileInputComponent: ComponentType;

    private routeLayerFitBoundsToolId = 'fit-bounds';
    public abstract routeLayerFitBountsComponent: ComponentType<ToolProps>;

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolProps>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps>;

    public engage = (stateWarden: StateWarden) => {
        stateWarden.toolsStation.addControlComponent(this.fileInputControlId, this.fileInputComponent);
        stateWarden.toolsStation.addToolComponent(this.routeLayerFitBoundsToolId, 'left', this.routeLayerFitBountsComponent);
        stateWarden.toolsStation.addToolComponent(this.playerToolId, 'bottom', this.playerComponent);
        stateWarden.cartomancer.addOverlay(this.routeOverlayId, this.routeLayerComponent);
        stateWarden.cartomancer.addOverlay(this.imagesOverlayId, this.imagesLayerComponent);
    };

    public disengage = (stateWarden: StateWarden) => {
        stateWarden.cartomancer.removeOverlay(this.imagesOverlayId);
        stateWarden.cartomancer.removeOverlay(this.routeOverlayId);
        stateWarden.toolsStation.removeToolComponent(this.playerToolId);
        stateWarden.toolsStation.removeToolComponent(this.routeLayerFitBoundsToolId);
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
