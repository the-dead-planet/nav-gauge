import { BehaviorSubject } from "rxjs";
import { SurveillanceState, LoadedImageData, ChronoLens } from "@apparatus";
import { getSplineHeading, getRouteSourceData } from "./tinkers";
import { getImageIconSize, FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE } from "./images";
import { RouteStoryGear } from "./route-story-gear";
import { IMAGE_ANIMATION_DURATION } from "./layer-specification";
import { RouteStoryFile, RouteStoryProps } from "./model";
import { DesignSystemColor, ThemeComponentColor } from "@ui";

export class PlayerOperator<TMap, TChronoLens extends ChronoLens, TFile extends RouteStoryFile, TImageData> {
    private gear: RouteStoryGear<TMap, TChronoLens, TFile, TImageData>;

    public isLoading$ = new BehaviorSubject(false);
    public showImageMarkers$ = new BehaviorSubject(true);

    public constructor(
        gear: RouteStoryGear<TMap, TChronoLens, TFile, TImageData>,
    ) {
        this.gear = gear;
    }

    public getBlinkingColor = (surveillanceState: SurveillanceState): DesignSystemColor | ThemeComponentColor => {
        return surveillanceState === SurveillanceState.InProgress ? 'error' : 'neutral';
    }

    public onDestroy = () => {
        this.gear.apparatus.chronoLens.destroyRecording();
        this.onStop();
    };

    public onPlay = () => {
        this.gear.apparatus.chronoLens.isPlaying$.next(!this.gear.apparatus.chronoLens.isPlaying$.value);
    };

    public onStart = () => {
        const nextState = SurveillanceState.InProgress;
        this.gear.apparatus.chronoLens.surveillanceState$.next(nextState);
        this.gear.apparatus.cartomancer.blinkingState$.next({ color: this.getBlinkingColor(nextState) });
        this.gear.apparatus.toolsStation.addTopBarTool(this.gear.recTopBarToolId, this.gear.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, {}>(this.gear.topBarChipComponent, this.gear.getProps()));
    };

    public onStop = () => {
        this.gear.apparatus.chronoLens.surveillanceState$.next(SurveillanceState.Stopped);
        this.gear.apparatus.cartomancer.blinkingState$.next(null);
        this.gear.apparatus.toolsStation.removeTopBarTool(this.gear.recTopBarToolId);
    };

    public onPause = () => {
        this.gear.apparatus.chronoLens.surveillanceState$.next(SurveillanceState.Paused);
        this.gear.apparatus.cartomancer.blinkingState$.next({ color: "neutral" });
    };

    public onResume = () => {
        this.gear.apparatus.chronoLens.surveillanceState$.next(SurveillanceState.InProgress);
        this.gear.apparatus.cartomancer.blinkingState$.next({ color: "error" });
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
                this.gear.state$.value,
                this.gear.data$.value.geojson,
                this.gear.routeTimes$.value.startTimeEpoch,
                value,
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
        const geojson = this.gear.data$.value.geojson;
        const routeTimes = this.gear.routeTimes$.value;

        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        const splineData = this.gear.splineData$.value;
        if (!splineData) {
            return;
        }

        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const routeDuration = routeTimes.duration;
        const sortedImageFeatures = [...loadedImages].sort((a, b) => a.featureId - b.featureId);
        const nextImageTimes = sortedImageFeatures.map((imageFeature) => {
            const f = geojson.features.find((feature) => feature.properties.id === imageFeature.featureId);
            return f ? new Date(f.properties.time).valueOf() : null;
        });
        let last = performance.now();
        let currentProgressMs = this.gear.progressMs$.value;
        let nextImageIndex = nextImageTimes.findIndex((time) => time !== null && time >= startTimeEpoch + currentProgressMs);

        const animate = () => {
            const {
                routePlaybackDuration,
                displayImageDuration,
                followCurrentPoint,
                cameraAngle,
                easeDuration,
                autoRotate,
            } = this.gear.animatrix.controls$.value;

            const now = performance.now();
            const dt = now - last;
            last = now;
            currentProgressMs += dt * (routeDuration / routePlaybackDuration);
            if (startTimeEpoch + currentProgressMs >= endTimeEpoch) {
                currentProgressMs = 0;
                nextImageIndex = 0;
            }
            const nextImage: LoadedImageData<TImageData> | undefined = sortedImageFeatures[nextImageIndex];
            const nextImageTime = nextImageIndex >= 0 ? nextImageTimes[nextImageIndex] : null;
            const { currentPoint, line, splitIndex, fraction } = getRouteSourceData(this.gear.state$.value, geojson, startTimeEpoch, currentProgressMs);
            onUpdateLayer(currentPoint, line);

            if (this.animation !== undefined && nextImage && nextImageTime !== null && nextImageTime <= startTimeEpoch + currentProgressMs) {
                nextImageIndex = nextImageIndex + 1;
                cancelAnimationFrame(this.animation);

                let settleDelay = 0;
                if (followCurrentPoint) {
                    const lngLat: GeoJSON.Position = [currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]];
                    const currentPointHeading = autoRotate ? getSplineHeading(splineData, splitIndex, fraction) : 0;
                    onUpdateMapCamera(lngLat, cameraAngle + currentPointHeading);
                    settleDelay = easeDuration;
                }

                const showImage = () => {
                    this.gear.animatrix.displayImageId$.next(nextImage.id);
                    this.displayImageTimeout = setTimeout(() => {
                        last = performance.now();
                        this.gear.animatrix.displayImageId$.next(null);
                        this.animation = requestAnimationFrame(animate);
                    }, displayImageDuration);
                };

                if (settleDelay > 0) {
                    this.displayImageTimeout = setTimeout(showImage, settleDelay);
                } else {
                    showImage();
                }

                return;
            }

            if (followCurrentPoint) {
                const lngLat: GeoJSON.Position = [currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]];
                const currentPointHeading = autoRotate ? getSplineHeading(splineData, splitIndex, fraction) : 0;
                onUpdateMapCamera(lngLat, cameraAngle + currentPointHeading);
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            this.gear.progressMs$.next(currentProgressMs);
            this.animation = requestAnimationFrame(animate);
        };

        this.animation = requestAnimationFrame(animate);
    };

    public cleanupAnimateRoute = () => {
        clearTimeout(this.displayImageTimeout);
        this.gear.animatrix.displayImageId$.next(null);

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
        const start = performance.now();

        const frame = () => {
            const progress = Math.min((performance.now() - start) / IMAGE_ANIMATION_DURATION, 1);
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
        const animationControls = this.gear.animatrix.controls$.value;
        this.inDisplayImageTimeout = setTimeout(() => this.animateIconSize(to, from, updateIconSize), animationControls.displayImageDuration - IMAGE_ANIMATION_DURATION)
    };

    public cleanupAnimateDisplayImage = (updateIconSize: (value: number) => void) => {
        clearTimeout(this.inDisplayImageTimeout);
        updateIconSize(getImageIconSize(FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE));
    };
};
