import { ComponentType, FC } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
import { ToolProps, MarkerImage, OverlayComponentProps, StateWarden, Gear, ControlComponentProps, Individuator, parsers, FileToGeoJSONParser, ChronoLens, SignaliumBureau } from "@apparatus";
import { GeoJson, getNext, ParsingResultWithError } from "@tinker-chest";
import { RouteToolProps, RouteTimes, RouteFileInputProps, RouteFitBoundsProps, PlayerOperator, FileOperator } from "./model";

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
                images$: this.images$,
                fileOperator: this.fileOperator,
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
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
            })
        );

        stateWarden.cartomancer.addOverlay(
            this.routeOverlayId,
            this.wrapProps<RouteToolProps, OverlayComponentProps<TMap>>(this.routeLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
            })
        );
        stateWarden.cartomancer.addOverlay(
            this.imagesOverlayId,
            this.wrapProps<RouteToolProps, OverlayComponentProps<TMap>>(this.imagesLayerComponent, {
                data$: this.data$,
                routeTimes$: this.routeTimes$,
                images$: this.images$,
                progressMs$: this.progressMs$,
                playerOperator: this.playerOperator,
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

    private fileOperator: FileOperator = {
        isLoading$: new BehaviorSubject(false),
        onError: (error: Error, signaliumBureau: SignaliumBureau) => {
            {
                const id = 'file-upload';
                signaliumBureau.addNotice({
                    id,
                    type: 'error',
                    text: 'File upload failed',
                    error,
                });
            }
        },
        uploadFile: async <TFile extends { name?: string | null; type: string | null; }>(
            files: TFile[],
            signaliumBureau: SignaliumBureau,
            getText: (file: TFile) => Promise<string>,
            readImage: (file: TFile, geojson?: GeoJson) => void,
        ) => {
            try {
                if (files.length === 0) {
                    return;
                }
                this.fileOperator.isLoading$.next(true);
                let currentGeojson: GeoJson | undefined = this.data$.value.geojson;
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
                    this.data$.next({});
                    const text = await getText(geojsonFile).catch((error: Error) => {
                        this.fileOperator.onError(error, signaliumBureau);
                        this.fileOperator.isLoading$.next(false);
                    }) ?? '';
                    const result = await parsers
                        .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name!))
                        ?.parse(text);

                    this.data$.next(result ?? { error: new Error('No parser found for file.') });
                    currentGeojson = result?.geojson
                }

                imageFiles.forEach((file) => readImage(file, currentGeojson));
            } catch (err) {
                this.fileOperator.onError(err as Error, signaliumBureau);
            } finally {
                this.fileOperator.isLoading$.next(false);
            }
        },

        pushInitialImage(current: MarkerImage[], fileName: string): MarkerImage[] {
            return current
                .filter((el) => el.name !== fileName)
                .concat([{
                    id: getNext(current.map((el) => el.id)),
                    name: fileName,
                    progress: 0
                }]);
        },

        updateImageProgress(current: MarkerImage[], fileName: string, progress: number) {
            const nextImages = current.slice();
            const index = current.findIndex((el) => el.name === fileName);
            nextImages[index] = { ...nextImages[index], progress: Number(progress.toFixed(0)) };

            return nextImages;
        },

        updateImageError(current: MarkerImage[], fileName: string, message?: string) {
            const nextImages = current.slice();
            const index = current.findIndex((el) => el.name === fileName);
            nextImages[index] = { ...nextImages[index], error: message ?? 'Cannot read file' };

            return nextImages;
        }
    }

    private playerOperator: PlayerOperator = {
        updateProgress: (
            value: number,
            chronoLens: ChronoLens,
            updateLayer: (geojson: GeoJson, routeTimes: RouteTimes, value: number) => void,
        ) => {
            if (!this.routeTimes$.value || isNaN(value)) {
                return;
            }
            // Halt playing animations to allow manual update.
            if (chronoLens.isPlaying$.value) {
                chronoLens.isPlaying$.next(false);
            }
            this.progressMs$.next(value);
            if (this.data$.value.geojson) {
                updateLayer(this.data$.value.geojson, this.routeTimes$.value, value);
            }
            // Resume playing animations
            if (chronoLens.isPlaying$.value) {
                setTimeout(() => chronoLens.isPlaying$.next(true), 0);
            }
        }
    }
};
