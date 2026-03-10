// import {
//     startInAppRecording,
//     stopInAppRecording,
//     clearCache,
// } from 'react-native-nitro-screen-recorder';
import { ChronoLens } from "@apparatus";

export class MobileChronoLens extends ChronoLens {
    public startRecording = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        this.isPlaying$.next(true);
        // try {
        //     console.log("Starting recording")
        //     startInAppRecording({
        //         options: {
        //             enableMic: false,
        //             enableCamera: false,
        //         },
        //         onRecordingFinished: (file) => {
        //             console.log("finished", file)
        //         },
        //     });
        // } catch (err) {
        //     onError?.("recording", err as Error);
        // }
    };

    public stopRecording = async () => {
        this.isPlaying$.next(false);
        // const file = await stopInAppRecording();
        // if (file?.path) {
        //     this.segments.push(file.path);
        // }
        this.download();
        this.destroyRecording();
    };

    public download = () => {

    };

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
        // clearCache();
    };
}