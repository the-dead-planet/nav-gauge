import { BehaviorSubject, pairwise, Subscription } from "rxjs";
import { FrameRate, SurveillanceState } from "./model";
import { Individuator } from "../../machine-ward";
import { SignaliumBureau } from "../signalium-bureau";

/**
 * Records the videos.
 */
export abstract class ChronoLens {
    protected individuator: Individuator;

    /**
     * Frames per second. Defaults to 30.
     */
    public fps$ = new BehaviorSubject<FrameRate>(30);
    // TODO: Combine isPlaying and state?
    public surveillanceState$ = new BehaviorSubject<SurveillanceState>(SurveillanceState.Stopped);
    public isPlaying$ = new BehaviorSubject(false);
    public downloadName$ = new BehaviorSubject('Voyage Log');

    private subscription: Subscription | null = null;
    private noticeId = 'chrono-lens-recording';

    public constructor(individuator: Individuator) {
        this.individuator = individuator;
    }

    public setUpSurveillance = (signaliumBureau: SignaliumBureau) => {
        this.subscription = this.surveillanceState$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                switch (next) {
                    case SurveillanceState.Stopped:
                        this.stopRecording();
                        break;
                    case SurveillanceState.Paused:
                        this.pauseRecording?.();
                        break;
                    case SurveillanceState.InProgress: {
                        if (prev === SurveillanceState.Paused) {
                            this.resumeRecording?.();
                        } else {
                            this.startRecording((stage, error) => {
                                signaliumBureau.addNotice({
                                    id: this.noticeId,
                                    type: 'error',
                                    error,
                                    text: `Something went wrong during the ${stage} stage.`
                                });
                            });
                        }
                        break;
                    }
                }
            })
    };

    public clearSurveillance = () => {
        this.subscription?.unsubscribe();
    };

    /**
     * Removes spaces and underscores.
     */
    public static sanitiseName(value: string): string {
        return value.replaceAll(/[.:_\s]/g, "");
    }

    /**
     * Callback to trigger when user starts the screen recording
     */
    public abstract startRecording: (onError?: (stage: string, error: Error) => void) => Promise<void>;

    /**
     * Callback to pause recording (user should be able to resume later).
     */
    public pauseRecording?: () => Promise<void>;

    /**
     * Callback to resume recording.
     */
    public resumeRecording?: () => Promise<void>;

    /**
     * Callback to stop the recorder.
     */
    public abstract stopRecording: () => Promise<void>;

    /**
     * Creates a video file with the data recorded by the screen recorder.
     */
    public abstract download: () => void;

    /**
     * Resets the recorder and any files created on the way completely.
     */
    public abstract destroyRecording: () => void;
}