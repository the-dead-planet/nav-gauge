import { BehaviorSubject, Subscription } from "rxjs";
import { validateBoolean, validateNumber } from "@tinker-chest";
import { AnimationControlsType, AnimatrixTranslationKey } from "./model";
import { StorageKeeper, TranslationTable, Translatron } from "@apparatus";
import * as Translations from "./translations";
import { CLOCK_INPUT_RANGE } from "@ui";

/**
 * Animation central processing unit.
 */
export class Animatrix {
    public namespace = 'animatrix';
    public translations: TranslationTable<AnimatrixTranslationKey> = Translations;
    public translationKey = AnimatrixTranslationKey;

    public static defaultControls: AnimationControlsType = {
        followCurrentPoint: true,
        autoRotate: true,
        bearingLineLengthInMeters: 500,
        maxBearingDiffPerFrame: 5,
        cameraAngle: 0,
        pitch: 0,
        zoom: 12,
        displayImageDuration: 3000,
        cameraRoll: 0,
        speedMultiplier: 5000,
        easeDuration: 100,
    };

    public static displayImageDurationRange: [number, number] = [0, 10000];
    public static pitchRange: [number, number] = [0, 85];
    public static zoomRange: [number, number] = [0, 20];
    public static bearingLineLengthInMetersRange: [number, number] = [0, 100000];
    public static maxBearingDiffPerFrameRange: [number, number] = [CLOCK_INPUT_RANGE[0], CLOCK_INPUT_RANGE[1]];
    public static cameraAngleRange: [number, number] = [CLOCK_INPUT_RANGE[0], CLOCK_INPUT_RANGE[1]];
    public static cameraRollRange: [number, number] = [CLOCK_INPUT_RANGE[0], CLOCK_INPUT_RANGE[1]];
    public static speedMultiplierRange: [number, number] = [0, 250000];
    public static easeDurationRange: [number, number] = [0, 1000];

    private controlsStorageId = 'animatrix:controls';
    private controlsStorageSubscription: Subscription | null = null;
    public controls$: BehaviorSubject<AnimationControlsType>;

    public constructor() {
        this.controls$ = new BehaviorSubject(Animatrix.defaultControls);
    }

    public initialize = (
        storageKeeper: StorageKeeper,
        translatron: Translatron,
    ) => {
        translatron.register(this.namespace, this.translations);
        storageKeeper.synchronizeSubjectWithStorage(this.controls$, this.controlsStorageId, this.cleanUpAnimationControls)
            .then((s) => {
                this.controlsStorageSubscription = s;
            });
    };

    public cleanUp = () => {
        this.controlsStorageSubscription?.unsubscribe();
    };

    /**
     * Which image should be in display now.
     */
    public displayImageId$ = new BehaviorSubject<number | null>(null);

    private cleanUpAnimationControls = (state: unknown): Partial<AnimationControlsType> => {
        const { cameraAngle, ...controls } = state as AnimationControlsType;
        return {
            cameraAngle: typeof cameraAngle === 'number' ? cameraAngle : Animatrix.defaultControls.cameraAngle,
            ...controls
        };
    };

    public static validateAnimationControls = (animationControls: Partial<AnimationControlsType>) => {
        validateBoolean(animationControls.followCurrentPoint, 'Follow current point');
        validateBoolean(animationControls.autoRotate, "Auto rotate");
        validateNumber(animationControls.bearingLineLengthInMeters, "Bearing line length in meters", Animatrix.bearingLineLengthInMetersRange);
        validateNumber(animationControls.maxBearingDiffPerFrame, "Max bearing diff per frame", Animatrix.maxBearingDiffPerFrameRange);
        validateNumber(animationControls.cameraAngle, 'Camera angle', Animatrix.cameraAngleRange);
        validateNumber(animationControls.cameraRoll, 'Camera roll', Animatrix.cameraRollRange);
        validateNumber(animationControls.pitch, 'Pitch', Animatrix.pitchRange);
        validateNumber(animationControls.zoom, 'Zoom', Animatrix.zoomRange);
        validateNumber(animationControls.displayImageDuration, 'Image pause duration', Animatrix.displayImageDurationRange);
        validateNumber(animationControls.speedMultiplier, 'Speed in seconds per frame', Animatrix.speedMultiplierRange);
        validateNumber(animationControls.easeDuration, 'Ease duration', Animatrix.easeDurationRange);
    }
}