import { FC } from "react";
import { SurveillanceState, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useWebMachineWard } from "@web-apparatus";
import { Button } from "@web-ui";
import { Icons } from "@ui";
import { WebPlayerOperator } from "../model";
import styles from './recording-buttons.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    playerOperator: WebPlayerOperator;
}

export const RecordingButtons: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens } = useWebMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    // const [hasRecordingData] = useSubjectState(chronoLens.hasRecordingData$);

    const [
        // destroyLabel,
        startRecordingLabel,
        stopRecordingLabel,
        // pauseRecordingLabel,
        // resumeRecordingLabel,
        recordCaption,
        stopCaption,
        // pauseCaption,
        // resumeCaption,
        // destroyCaption,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.DestroyRecording },
        { n: gearId, t: translationKey.StartRecording },
        { n: gearId, t: translationKey.StopRecording },
        { n: gearId, t: translationKey.PauseRecording },
        { n: gearId, t: translationKey.ResumeRecording },
        { n: gearId, t: translationKey.Record },
        { n: gearId, t: translationKey.Stop },
        { n: gearId, t: translationKey.Pause },
        { n: gearId, t: translationKey.Resume },
        { n: gearId, t: translationKey.Destroy },
    ]);

    return (
        <>
            {surveillanceState === SurveillanceState.Stopped ? (
                <Button
                    icon={Icons.RecordCapture}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={startRecordingLabel}
                    caption={recordCaption}
                    tooltip={startRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onStart()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.Recording}
                    size="md"
                    variant="ghost"
                    color={surveillanceState === SurveillanceState.InProgress ? "secondary" : "neutral"}
                    corners="circle"
                    aria-label={stopRecordingLabel}
                    caption={stopCaption}
                    tooltip={stopRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onStop()}
                    className={styles['blinking']}
                />
            )}
            {/* {surveillanceState === SurveillanceState.Paused ? (
                <Button
                    icon={Icons.NounProject.ResumeRecording}
                    size="md"
                    variant="ghost"
                    color="secondary"
                    corners="circle"
                    aria-label={resumeRecordingLabel}
                    caption={resumeCaption}
                    tooltip={resumeRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onResume()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.PauseRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={pauseRecordingLabel}
                    caption={pauseCaption}
                    tooltip={pauseRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onPause()}
                    disabled={surveillanceState === SurveillanceState.Stopped}
                />
            )}
            <Button
                icon={Icons.NounProject.Destroy}
                size="md"
                variant="ghost"
                color={hasRecordingData ? "secondary" : "neutral"}
                corners="circle"
                aria-label={destroyLabel}
                caption={destroyCaption}
                tooltip={destroyLabel}
                tooltipPlacement="top"
                onClick={() => playerOperator.onDestroy()}
                disabled={!hasRecordingData}
            /> */}
        </>
    );
};
