import { BehaviorSubject } from "rxjs";
import { FrameRate, SurveillanceState } from "./model";

/**
 * Records the videos.
 */
export class ChronoLens {
    /**
     * Frames per second. Defaults to 30.
     */
    public fps$ = new BehaviorSubject<FrameRate>(30);
    // TODO: Combine isPlaying and state?
    public surveillanceState$ = new BehaviorSubject<SurveillanceState>(SurveillanceState.Stopped);
    public isPlaying$ = new BehaviorSubject(false);
    public downloadName$ = new BehaviorSubject('Voyage Log');

    public constructor() { }
}