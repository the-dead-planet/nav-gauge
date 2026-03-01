import { BehaviorSubject } from "rxjs";
import { StateWarden, SurveillanceState, LoadedImageData } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { RouteTimes } from "./model";
import { getRouteSourceData } from "./tinkers";

export class PlayerOperator<TMap> {
    private stateWarden: StateWarden<TMap>;
    private data$: BehaviorSubject<ParsingResultWithError>;
    private routeTimes$: BehaviorSubject<RouteTimes | null>;
    private progressMs$: BehaviorSubject<number>;
    public isLoading$ = new BehaviorSubject(false);

    constructor(
        stateWarden: StateWarden<TMap>,
        data$: BehaviorSubject<ParsingResultWithError>,
        routeTimes$: BehaviorSubject<RouteTimes | null>,
        progressMs$: BehaviorSubject<number>,
    ) {
        this.stateWarden = stateWarden;
        this.data$ = data$;
        this.routeTimes$ = routeTimes$;
        this.progressMs$ = progressMs$;
    }

    public onPlay = () => {
        this.stateWarden.chronoLens.isPlaying$.next(!this.stateWarden.chronoLens.isPlaying$.value);
    };

    public onRecord = () => {
        this.stateWarden.chronoLens.surveillanceState$.next(this.stateWarden.chronoLens.surveillanceState$.value === SurveillanceState.Stopped
            ? SurveillanceState.InProgress
            : SurveillanceState.Stopped)
    };

    public onRecordPause = () => {
        this.stateWarden.chronoLens.surveillanceState$.next(this.stateWarden.chronoLens.surveillanceState$.value === SurveillanceState.Paused
            ? SurveillanceState.InProgress
            : SurveillanceState.Paused)
    };

    public updateProgress = (
        value: number,
        updateLayer?: (
            currentPoint: GeoJSON.Feature<GeoJSON.Point>,
            lines: GeoJSON.GeoJSON,
        ) => void,
    ) => {
        if (!this.routeTimes$.value || isNaN(value)) {
            return;
        }
        // Halt playing animations to allow manual update.
        if (this.stateWarden.chronoLens.isPlaying$.value) {
            this.stateWarden.chronoLens.isPlaying$.next(false);
        }
        this.progressMs$.next(value);
        if (this.data$.value.geojson) {
            const { currentPoint, lines } = getRouteSourceData(
                this.stateWarden.cartomancer.gaugeControls$.value,
                this.data$.value.geojson,
                this.routeTimes$.value.startTimeEpoch,
                value,
                this.stateWarden.animatrix.controls$.value.bearingLineLengthInMeters
            );
            updateLayer?.(currentPoint, lines);
        }
        // Resume playing animations
        if (this.stateWarden.chronoLens.isPlaying$.value) {
            setTimeout(() => this.stateWarden.chronoLens.isPlaying$.next(true), 0);
        }
    };

    private animation: number | undefined;
    private displayImageTimeout: Timer | undefined;

    public animateRoute = (
        loadedImages: LoadedImageData[],
        onUpdateLayer: (currentPoint: GeoJSON.Feature<GeoJSON.Point>, lines: GeoJSON.GeoJSON) => void,
        onUpdateMapCamera: (position: GeoJSON.Position, bearing: number) => void,
    ) => {
        const isPlaying = this.stateWarden.chronoLens.isPlaying$.value;
        const progressMs = this.progressMs$.value;
        const geojson = this.data$.value.geojson;
        const routeTimes = this.routeTimes$.value;
        const {
            speedMultiplier,
            bearingLineLengthInMeters,
            displayImageDuration,
            followCurrentPoint,
            cameraAngle,
            autoRotate,
            maxBearingDiffPerFrame,
        } = this.stateWarden.animatrix.controls$.value;
        const gaugeControls = this.stateWarden.cartomancer.gaugeControls$.value;

        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }

        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = [...loadedImages].sort((a, b) => a.featureId - b.featureId);
        let last = Date.now();
        let currentProgressMs = this.progressMs$.value;
        let nextImageIndex = sortedImageFeatures.findIndex((imageFeature): boolean => {
            const f = geojson.features.find((feature) => feature.properties.id === imageFeature.featureId);
            return !!f && new Date(f.properties.time).valueOf() >= new Date(startTimeEpoch + progressMs).valueOf();
        });

        const animate = () => {
            const now = Date.now();
            const dt = now - last;
            last = now;
            currentProgressMs += dt + speedMultiplier;
            if (startTimeEpoch + currentProgressMs >= endTimeEpoch) {
                currentProgressMs = 0;
                nextImageIndex = 0;
            }
            const nextImage: LoadedImageData | undefined = sortedImageFeatures[nextImageIndex];
            const { currentPoint, lines, currentPointBearing } = getRouteSourceData(gaugeControls, geojson, startTimeEpoch, currentProgressMs, bearingLineLengthInMeters, nextImage?.featureId);
            onUpdateLayer(currentPoint, lines);

            if (this.animation !== undefined && nextImage && nextImage.featureId <= Number(currentPoint.id)) {
                this.stateWarden.animatrix.displayImageId$.next(nextImage.id);
                nextImageIndex = nextImageIndex + 1;
                cancelAnimationFrame(this.animation);
                this.displayImageTimeout = setTimeout(() => {
                    this.stateWarden.animatrix.displayImageId$.next(null);
                    this.animation = requestAnimationFrame(animate);
                }, displayImageDuration);

                return;
            }

            if (followCurrentPoint) {
                const lngLat: GeoJSON.Position = [currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]];
                const currentBearing = this.stateWarden.cartomancer.bearing$.value; const nextBearing = (cameraAngle + (autoRotate ? currentPointBearing : 0));
                const bearingDiff = ((nextBearing - currentBearing + 540) % 360) - 180;
                const bearing = currentBearing + Math.max(-maxBearingDiffPerFrame, Math.min(maxBearingDiffPerFrame, bearingDiff));

                onUpdateMapCamera(lngLat, bearing)
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            this.progressMs$.next(currentProgressMs);
            this.animation = requestAnimationFrame(animate);
        };

        this.animation = requestAnimationFrame(animate);
    };

    public cleanupAnimateRoute = () => {
        clearTimeout(this.displayImageTimeout);
        this.stateWarden.animatrix.displayImageId$.next(null);

        if (this.animation !== undefined) {
            cancelAnimationFrame(this.animation);
        }
    };
};
