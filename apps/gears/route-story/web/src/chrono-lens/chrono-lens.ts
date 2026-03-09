import { ChronoLens, SurveillanceState } from "@apparatus";

/**
 * Records the videos.
 */
export class WebChronoLens extends ChronoLens {
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];
    public canvas: HTMLCanvasElement | null = null;

    public startRecording = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        this.isPlaying$.next(true);
        if (!this.recorder) {
            await this.setup(onError);
        }
        this.recorder?.start();
    };

    public pauseRecording = () => {
        this.recorder?.pause();
        this.isPlaying$.next(false);
    };

    public resumeRecording = () => {
        this.recorder?.resume();
        this.isPlaying$.next(true);
    };

    public stopRecording = () => {
        this.recorder?.stop();
    };

    private setup = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        try {
            this.stream = await this.createStream();
            this.recorder = this.createRecorder(this.stream, onError);
        } catch (error) {
            this.isPlaying$.next(false);
            this.surveillanceState$.next(SurveillanceState.Stopped);
            this.destroyRecording();
            onError?.("setup", error as Error);
        }
    }

    private createStream = async (): Promise<MediaStream> => {
        if (this.canvas) {
            return this.canvas.captureStream(this.fps$.value);
        }
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
        onError?: (stage: string, error: Error) => void
    ): MediaRecorder => {
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        }

        recorder.onpause = () => { }
        recorder.onresume = () => { }

        recorder.onstop = () => {
            this.stop();
            this.download();
            this.destroyRecording();
        };

        recorder.onerror = (event) => {
            this.destroyRecording();
            onError?.("recording", event.error);
        };

        return recorder;
    }

    private stop = () => {
        this.isPlaying$.next(false);
        this.surveillanceState$.next(SurveillanceState.Stopped);
    };

    public download = () => {
        const timestamp = this.individuator.formatTimestamp(new Date().valueOf(), this.individuator.settings$.value);
        const blob = new Blob(this.chunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.id = "download-action"
        a.style = "display: none";
        a.href = url;
        document.body.appendChild(a);
        a.download = `${ChronoLens.sanitiseName(this.downloadName$.value + timestamp)}.webm`;
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
        this.recorder?.stop();

        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }

        this.stream = undefined;
        this.recorder = undefined;
        this.chunks = [];
    };
}
