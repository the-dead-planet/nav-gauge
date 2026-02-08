import { FrameRate, Individuator, IndividuatorSettings, SurveillanceState } from "@apparatus";

// TODO: Refactor after split from packages - consider abstract class which can be implemented in both web/ui
/**
 * Records the videos.
 */
export class WebChronoLens {
    private individuator: Individuator;

    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];

    public constructor(individuator: Individuator) {
        this.individuator = individuator;
    }

    public startRecording = async (
        canvas: HTMLCanvasElement,
        downloadName: string,
        settings: IndividuatorSettings,
        fps: FrameRate,
        onIsPlayingChange: (isPlaying: boolean) => void,
        onSurveillanceStateChange: (state: SurveillanceState) => void,
        onError?: (stage: string, error: Error) => void
    ) => {
        onIsPlayingChange(true);
        if (!this.recorder) {
            await this.setup(canvas, downloadName, settings, fps, onIsPlayingChange, onSurveillanceStateChange, onError);
        }
        this.recorder?.start();
    };

    public pauseRecording = (
        onIsPlayingChange: (isPlaying: boolean) => void
    ) => {
        this.recorder?.pause();
        onIsPlayingChange(false);
    };

    public resumeRecording = (
        onIsPlayingChange: (isPlaying: boolean) => void
    ) => {
        this.recorder?.resume();
        onIsPlayingChange(true);
    };

    public stopRecording = () => {
        this.recorder?.stop();
    };

    private setup = async (
        canvas: HTMLCanvasElement | undefined,
        downloadName: string,
        settings: IndividuatorSettings,
        fps: FrameRate,
        onIsPlayingChange: (isPlaying: boolean) => void,
        onSurveillanceStateChange: (state: SurveillanceState) => void,
        onError?: (stage: string, error: Error) => void
    ) => {
        try {
            this.stream = await this.createStream(canvas, fps);
            this.recorder = this.createRecorder(this.stream, downloadName, settings, onIsPlayingChange, onSurveillanceStateChange, onError);
        } catch (error) {
            onIsPlayingChange(false);
            onSurveillanceStateChange(SurveillanceState.Stopped);
            this.destroyRecording();
            onError?.("setup", error as Error);
        }
    }

    private createStream = async (
        canvas: HTMLCanvasElement | undefined,
        fps: FrameRate
    ): Promise<MediaStream> => {
        if (canvas) {
            return canvas.captureStream(fps);
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: fps
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
        downloadName: string,
        settings: IndividuatorSettings,
        onIsPlayingChange: (isPlaying: boolean) => void,
        onSurveillanceStateChange: (state: SurveillanceState) => void,
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
            this.stop(onIsPlayingChange, onSurveillanceStateChange);
            this.download(downloadName, settings);
            this.destroyRecording();
        };

        recorder.onerror = (event) => {
            this.destroyRecording();
            onError?.("recording", event.error);
        };

        return recorder;
    }

    private stop = (
        onIsPlayingChange: (isPlaying: boolean) => void,
        onSurveillanceStateChange: (state: SurveillanceState) => void,
    ) => {
        onIsPlayingChange(false);
        onSurveillanceStateChange(SurveillanceState.Stopped);
    };

    private download = (downloadName: string, settings: IndividuatorSettings) => {
        const timestamp = this.individuator.formatTimestamp(new Date().valueOf(), settings);
        const blob = new Blob(this.chunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.id = "download-action"
        a.style = "display: none";
        a.href = url;
        document.body.appendChild(a);
        a.download = `${this.sanitiseName(downloadName + timestamp)}.webm`;
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    private sanitiseName(value: string): string {
        return value.replaceAll(/[.:_\s]/g, "");
    }

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
