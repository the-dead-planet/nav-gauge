import RNFS from 'react-native-fs';
import { ViewRecorder } from "react-native-view-recorder";
import { ChronoLens } from "@apparatus";

export class MobileChronoLens extends ChronoLens {
    public viewRecorder: ViewRecorder | null = null;

    public startRecording = async (
        onError: (stage: string, error: Error) => void,
        abortSignal: AbortSignal,
    ) => {
        if (!this.viewRecorder) {
            onError("setup", new Error("No view recorder attached."));
            return;
        }
        this.isPlaying$.next(true);

        console.log("cache path", RNFS.DownloadDirectoryPath)
        this.viewRecorder.record({
            fps: this.fps$.value,
            output: `${RNFS.DownloadDirectoryPath}/${ChronoLens.sanitiseName(this.downloadName$.value)}.mp4`,
            onFrame: (info) => {
                // 
            },
            onProgress: (info) => {
                //
            },
            signal: abortSignal,
            quality: 1,
        });
    };

    public stopRecording = async () => {
        this.isPlaying$.next(false);
        this.viewRecorder?.stop();
        this.download();
        this.destroyRecording();
    };

    public download = () => {

    };

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
        // Done by useViewRecorder on component unmount
    };
}