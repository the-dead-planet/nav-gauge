import { BehaviorSubject } from "rxjs";
import { FrameRate, SurveillanceState } from "./model";
import { Individuator } from "..";

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

    public constructor(individuator: Individuator) {
        this.individuator = individuator;
    }

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
    public abstract pauseRecording: () => void;

    /**
     * Callback to resume recording.
     */
    public abstract resumeRecording: () => void;

    /**
     * Callback to stop the recorder.
     */
    public abstract stopRecording: () => void;

    /**
     * Creates a video file with the data recorded by the screen recorder.
     */
    public abstract download: () => void;

    /**
     * Resets the recorder and any files created on the way completely.
     */
    public abstract destroyRecording: () => void;
}