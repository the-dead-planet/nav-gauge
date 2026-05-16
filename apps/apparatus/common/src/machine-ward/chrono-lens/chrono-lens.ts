import { BehaviorSubject, pairwise, Subscription } from "rxjs";
import { FrameRate, SurveillanceState } from "./model";
import { Individuator } from "../machine-ward";
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

    /**
     * For example "webm" or "mp4". Format in which videos are generated. Will be used in the file name.
     */
    public abstract fileType: string;

    private subscription: Subscription | null = null;
    protected noticeId = 'chrono-lens-recording';

    public constructor(individuator: Individuator) {
        this.individuator = individuator;
    }

    public setUpSurveillance = (signaliumBureau: SignaliumBureau, abortSignal: AbortSignal) => {
        this.subscription = this.surveillanceState$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                switch (next) {
                    case SurveillanceState.Stopped:
                        this.stop(signaliumBureau);
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
                            }, abortSignal);
                        }
                        break;
                    }
                }
            })
    };

    public clearSurveillance = () => {
        this.subscription?.unsubscribe();
    };

    private stop = (signaliumBureau: SignaliumBureau) => {
        this.isPlaying$.next(false);
        this.stopRecording();
        this.download(signaliumBureau).then(this.destroyRecording);
    }

    /**
     * Removes spaces and underscores.
     */
    public static sanitiseName(value: string): string {
        return value.replaceAll(/[.:_\s]/g, "");
    }

    /**
     * Provides the sanitised name with a timestamp formatted according to individuator settings.
     * @example getDownloadFileName() "VoyageLog_Sat13032026092231.webm"
     */
    protected getDownloadFileName = (): string => {
        const timestamp = this.individuator.formatTimestamp(new Date().valueOf(), this.individuator.settings$.value);
        return `${ChronoLens.sanitiseName(this.downloadName$.value + timestamp)}.${this.fileType}`;
    };

    /**
     * Callback to trigger when user starts the screen recording
     */
    public abstract startRecording: (
        onError: (stage: string, error: Error) => void,
        abortSignal: AbortSignal,
    ) => Promise<void>;

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
    public abstract download: (signaliumBureau: SignaliumBureau) => Promise<void>;

    /**
     * Resets the recorder and any files created on the way completely.
     */
    public abstract destroyRecording: () => void;
}