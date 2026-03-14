import RNFS from 'react-native-fs';
import { viewDocument } from '@react-native-documents/viewer'
import { ViewRecorder } from "react-native-view-recorder";
import { ChronoLens, Individuator, SignaliumBureau } from "@apparatus";

export class MobileChronoLens extends ChronoLens {
    public viewRecorder: ViewRecorder | null = null;
    public fileType = "mp4";

    public constructor(individuator: Individuator) {
        super(individuator);
        this.setUpFolder();
    }

    public startRecording = async (
        onError: (stage: string, error: Error) => void,
        abortSignal: AbortSignal,
    ) => {
        if (!this.viewRecorder) {
            onError("setup", new Error("No view recorder attached."));
            return;
        }
        this.isPlaying$.next(true);
        this.updateWorkingFileName();

        this.viewRecorder.record({
            output: this.getWorkingFilePath(),
            fps: this.fps$.value,
            quality: 1,
            signal: abortSignal,
        }).catch((err) => onError("recording", err as Error));
    };

    public stopRecording = async () => {
        this.viewRecorder?.stop();
    };

    public download = async (signaliumBureau: SignaliumBureau) => {
        viewDocument({
            uri: "file://" + this.getWorkingFilePath(),
            mimeType: 'video/mp4',
        }).catch((err) => {
            signaliumBureau.addNotice({
                id: this.noticeId,
                type: 'error',
                error: err as Error,
                text: `Cannot view the recording video. ${(err as Error).message || 'Unknown reason.'}`
            });
        });
    };

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
        // Done by useViewRecorder on component unmount
    };

    private setUpFolder = async (): Promise<void> => {
        const appFolder = this.getAppFolderPath();
        const exists = await RNFS.exists(appFolder);
        if (!exists) {
            try {
                await RNFS.mkdir(appFolder);
            } catch (err) {
                console.error("Error creating app folder", err);
            }
        }
    };

    /**
     * To save the name for current recording. Includes timestamp of the recording start.
     */
    private workingFileName = this.getDownloadFileName();

    private updateWorkingFileName = () => {
        this.workingFileName = this.getDownloadFileName();
    };

    private getWorkingFilePath = (): string => {
        return `${this.getAppFolderPath()}/${this.workingFileName}`;
    };

    private getAppFolderPath = (): string => {
        return `${RNFS.DocumentDirectoryPath}/NavGauge`;
    };
}