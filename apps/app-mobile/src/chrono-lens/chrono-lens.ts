import { ChronoLens } from "@apparatus";

export class MobileChronoLens extends ChronoLens {
    
    public startRecording = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        this.isPlaying$.next(true);
    };

    public pauseRecording = () => {
        this.isPlaying$.next(false);
    };

    public resumeRecording = () => {
        this.isPlaying$.next(true);
    };

    public stopRecording = () => {
    };

    public download = () => {
        
    };

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
      
    }; 
}