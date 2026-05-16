import { BehaviorSubject } from "rxjs";
import { SurveillanceState, LoadedImageData } from "@apparatus";
import { getRouteSourceData } from "./tinkers";
import { getImageIconSize, FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE } from "./images";
import { RouteStoryGear } from "./route-story-gear";
import { IMAGE_ANIMATION_DURATION } from "./layer-specification";

export class PlayerOperator<TMap, TFile extends { name?: string | null; type: string | null; }, TImageData> {
    private gear: RouteStoryGear<TMap, TFile, TImageData>;

    public isLoading$ = new BehaviorSubject(false);

    public constructor(
        gear: RouteStoryGear<TMap, TFile, TImageData>,
    ) {
        this.gear = gear;
    }

    public onPlay = () => {
        this.gear.apparatus.chronoLens.isPlaying$.next(!this.gear.apparatus.chronoLens.isPlaying$.value);
    };

    public onRecord = () => {
        this.gear.apparatus.chronoLens.surveillanceState$.next(this.gear.apparatus.chronoLens.surveillanceState$.value === SurveillanceState.Stopped
            ? SurveillanceState.InProgress
            : SurveillanceState.Stopped)
    };

    public onRecordPause = () => {
        this.gear.apparatus.chronoLens.surveillanceState$.next(this.gear.apparatus.chronoLens.surveillanceState$.value === SurveillanceState.Paused
            ? SurveillanceState.InProgress
            : SurveillanceState.Paused)
    };

    public updateProgress = (
        value: number,
        updateLayer?: (
            line: GeoJSON.GeoJSON,
            currentPoint: GeoJSON.Feature<GeoJSON.Point>,
        ) => void,
    ) => {
        if (!this.gear.routeTimes$.value || isNaN(value)) {
            return;
        }
        // Halt playing animations to allow manual update.
        if (this.gear.apparatus.chronoLens.isPlaying$.value) {
            this.gear.apparatus.chronoLens.isPlaying$.next(false);
        }
        this.gear.progressMs$.next(value);
        if (this.gear.data$.value.geojson) {
            const { currentPoint, line } = getRouteSourceData(
                this.gear.apparatus.cartomancer.gaugeControls$.value,
                this.gear.data$.value.geojson,
                this.gear.routeTimes$.value.startTimeEpoch,
                value,
                this.gear.apparatus.animatrix.controls$.value.bearingLineLengthInMeters
            );
            updateLayer?.(line, currentPoint);
        }
        // Resume playing animations
        if (this.gear.apparatus.chronoLens.isPlaying$.value) {
            setTimeout(() => this.gear.apparatus.chronoLens.isPlaying$.next(true), 0);
        }
    };

    private animation: number | undefined;
    private displayImageTimeout: Timer | undefined;

    public animateRoute = (
        loadedImages: LoadedImageData<TImageData>[],
        onUpdateLayer: (currentPoint: GeoJSON.Feature<GeoJSON.Point>, lines: GeoJSON.GeoJSON) => void,
        onUpdateMapCamera: (position: GeoJSON.Position, bearing: number) => void,
    ) => {
        const isPlaying = this.gear.apparatus.chronoLens.isPlaying$.value;
        const progressMs = this.gear.progressMs$.value;
        const geojson = this.gear.data$.value.geojson;
        const routeTimes = this.gear.routeTimes$.value;
        const {
            speedMultiplier,
            bearingLineLengthInMeters,
            displayImageDuration,
            followCurrentPoint,
            cameraAngle,
            autoRotate,
            maxBearingDiffPerFrame,
        } = this.gear.apparatus.animatrix.controls$.value;
        const gaugeControls = this.gear.apparatus.cartomancer.gaugeControls$.value;

        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }

        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = [...loadedImages].sort((a, b) => a.featureId - b.featureId);
        let last = Date.now();
        let currentProgressMs = this.gear.progressMs$.value;
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
            const nextImage: LoadedImageData<TImageData> | undefined = sortedImageFeatures[nextImageIndex];
            const { currentPoint, line, currentPointBearing } = getRouteSourceData(gaugeControls, geojson, startTimeEpoch, currentProgressMs, bearingLineLengthInMeters, nextImage?.featureId);
            onUpdateLayer(currentPoint, line);

            if (this.animation !== undefined && nextImage && nextImage.featureId <= Number(currentPoint.id)) {
                this.gear.apparatus.animatrix.displayImageId$.next(nextImage.id);
                nextImageIndex = nextImageIndex + 1;
                cancelAnimationFrame(this.animation);
                this.displayImageTimeout = setTimeout(() => {
                    this.gear.apparatus.animatrix.displayImageId$.next(null);
                    this.animation = requestAnimationFrame(animate);
                }, displayImageDuration);

                return;
            }

            if (followCurrentPoint) {
                const lngLat: GeoJSON.Position = [currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]];
                const currentBearing = this.gear.apparatus.cartomancer.bearing$.value; const nextBearing = (cameraAngle + (autoRotate ? currentPointBearing : 0));
                const bearingDiff = ((nextBearing - currentBearing + 540) % 360) - 180;
                const bearing = currentBearing + Math.max(-maxBearingDiffPerFrame, Math.min(maxBearingDiffPerFrame, bearingDiff));

                onUpdateMapCamera(lngLat, bearing);
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            this.gear.progressMs$.next(currentProgressMs);
            this.animation = requestAnimationFrame(animate);
        };

        this.animation = requestAnimationFrame(animate);
    };

    public cleanupAnimateRoute = () => {
        clearTimeout(this.displayImageTimeout);
        this.gear.apparatus.animatrix.displayImageId$.next(null);

        if (this.animation !== undefined) {
            cancelAnimationFrame(this.animation);
        }
    };

    private easeInOut(t: number) {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    private animateIconSize = (
        from: number,
        to: number,
        updateIconSize: (value: number) => void,
    ): void => {
        const start = Date.now();

        const frame = () => {
            const progress = Math.min((Date.now() - start) / IMAGE_ANIMATION_DURATION, 1);
            const value = from + (to - from) * this.easeInOut(progress);

            updateIconSize(value);

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    private inDisplayImageTimeout: Timer | undefined;

    public animateDisplayImage = (
        mapSize: {
            width: number;
            height: number;
            devicePixelRatio?: number;
        },
        updateIconSize: (value: number) => void,
    ) => {
        const { width, height, devicePixelRatio = 1 } = mapSize;
        const from = getImageIconSize(FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE);
        const to = getImageIconSize(FULL_SIZE_IMAGE_SIZE, Math.min(width / devicePixelRatio, height / devicePixelRatio));
        this.animateIconSize(from, to, updateIconSize);
        const animationControls = this.gear.apparatus.animatrix.controls$.value;
        this.inDisplayImageTimeout = setTimeout(() => this.animateIconSize(to, from, updateIconSize), animationControls.displayImageDuration - IMAGE_ANIMATION_DURATION)
    };

    public cleanupAnimateDisplayImage = (updateIconSize: (value: number) => void) => {
        clearTimeout(this.inDisplayImageTimeout);
        updateIconSize(getImageIconSize(FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE));
    };
};
