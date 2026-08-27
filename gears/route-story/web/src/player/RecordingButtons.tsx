import type * as maplibregl from "maplibre-gl";
import { FC, useEffect } from "react";
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
    map: maplibregl.Map;
    playerOperator: WebPlayerOperator;
}

export const RecordingButtons: FC<Props> = ({
    gearId,
    translationKey,
    map,
    playerOperator,
}) => {
    const { chronoLens, signaliumBureau } = useWebMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    useEffect(() => {
        const abortController = new AbortController();
        chronoLens.canvas = map.getCanvas();
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
            chronoLens.canvas = null;
            chronoLens.clearSurveillance();
        };
    }, []);

    const [
        destroyLabel,
        startRecordingLabel,
        stopRecordingLabel,
        pauseRecordingLabel,
        resumeRecordingLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.DestroyRecording },
        { n: gearId, t: translationKey.StartRecording },
        { n: gearId, t: translationKey.StopRecording },
        { n: gearId, t: translationKey.PauseRecording },
        { n: gearId, t: translationKey.ResumeRecording },
    ]);

    return (
        <>
            {chronoLens.hasRecordingData() ? (
                <Button
                    icon={Icons.NounProject.Destroy}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={destroyLabel}
                    tooltip={destroyLabel}
                    tooltipPlacement="top"
                    onClick={() => chronoLens.destroyRecording()}
                />
            ) : null}
            {surveillanceState === SurveillanceState.Stopped ? (
                <Button
                    icon={Icons.RecordCapture}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={startRecordingLabel}
                    tooltip={startRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecord()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.Recording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={stopRecordingLabel}
                    tooltip={stopRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecord()}
                    className={styles['blinking']}
                />
            )}
            {surveillanceState === SurveillanceState.Paused ? (
                <Button
                    icon={Icons.NounProject.ResumeRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={resumeRecordingLabel}
                    tooltip={resumeRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecordPause()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.PauseRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={pauseRecordingLabel}
                    tooltip={pauseRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecordPause()}
                    disabled={surveillanceState === SurveillanceState.Stopped}
                />
            )}
        </>
    );
};
