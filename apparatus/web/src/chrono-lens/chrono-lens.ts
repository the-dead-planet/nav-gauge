import { ChronoLens, SignaliumBureau, SurveillanceState } from "@apparatus";

/**
 * Records the videos.
 */
export class WebChronoLens extends ChronoLens {
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];
    public canvas: HTMLCanvasElement | null = null;
    public fileType = "webm";

    public startRecording = async (
        signaliumBureau: SignaliumBureau,
        onError?: (stage: string, error: Error) => void
    ) => {
        this.isPlaying$.next(true);
        if (!this.recorder) {
            await this.setup(signaliumBureau, onError);
        }
        this.recorder?.start();
    };

    public pauseRecording = async () => {
        this.recorder?.pause();
        this.isPlaying$.next(false);
    };

    public resumeRecording = async () => {
        this.recorder?.resume();
        this.isPlaying$.next(true);
    };

    public stopRecording = async () => {
        this.recorder?.stop();
    };

    private setup = async (
        signaliumBureau: SignaliumBureau,
        onError?: (stage: string, error: Error) => void
    ) => {
        try {
            this.stream = await this.createStream();
            this.recorder = this.createRecorder(this.stream, signaliumBureau, onError);
        } catch (error) {
            this.isPlaying$.next(false);
            this.surveillanceState$.next(SurveillanceState.Stopped);
            this.destroyRecording();
            onError?.("setup", error as Error);
        }
    }

    /**
     * Captures stream of the canvas element, if available - does not require user consent.
     * Fallback to whole page recording with consent.
     */
    private createStream = async (): Promise<MediaStream> => {
        if (this.canvas) {
            return this.canvas.captureStream(this.fps$.value);
        }

        return this.createViewportStream();
    };

    /**
     * Requires user consent to record the whole page.
     */
    private createViewportStream = async (): Promise<MediaStream> => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: this.fps$.value
            },
            audio: false
        })
        const [videoTrack] = stream.getVideoTracks();

        const handler = () => {
            this.destroyRecording();
            videoTrack.removeEventListener("ended", handler)
        };
        videoTrack.addEventListener("ended", handler);

        return stream;
    };

    private createRecorder = (
        stream: MediaStream,
        signaliumBureau: SignaliumBureau,
        onError?: (stage: string, error: Error) => void
    ): MediaRecorder => {
        const candidates = [
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp9",
            "video/webm"
        ];

        const mimeType = candidates.find((type) => MediaRecorder.isTypeSupported(type));

        if (!mimeType) {
            throw new Error("No mime type supported");
        }

        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 8_000_000
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
            if (this.surveillanceState$.value === SurveillanceState.Stopped) {
                this.download(signaliumBureau)
                    .then(() => this.destroyRecording());
            }
        };

        recorder.onpause = () => { };
        recorder.onresume = () => { };

        recorder.onstop = () => {
            // Handled by surveillance state subscription
        };

        recorder.onerror = (event) => {
            this.surveillanceState$.next(SurveillanceState.Stopped);
            this.destroyRecording();
            onError?.("recording", event.error);
        };

        return recorder;
    }

    public download = async (signaliumBureau: SignaliumBureau) => {
        if (this.chunks.length === 0) {
            signaliumBureau.addNotice({
                type: 'warning',
                id: 'no-recording-chunks',
                text: 'No data recorded',
            });

            return;
        }
        const blob = new Blob(this.chunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.id = "download-action";
        a.style = "display: none";
        a.href = url;
        document.body.appendChild(a);
        a.download = this.getDownloadFileName();
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    public destroyRecording = () => {
        this.recorder?.stop();

        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }

        this.stream = undefined;
        this.recorder = undefined;
        this.chunks = [];
    };

    public hasRecordingData = (): boolean => {
        const hasStream = !!this.recorder && this.recorder.state !== 'inactive';

        return hasStream || !!this.stream || !!this.recorder || this.chunks.length > 0;
    };
}
