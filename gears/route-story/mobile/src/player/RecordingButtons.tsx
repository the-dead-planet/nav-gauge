import { FC, useEffect } from "react";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { SurveillanceState, useMachineWard, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@mobile-ui";
import { MobileMarkerImageData } from "../images/image-parser";
import { MobileMap } from "@mobile-apparatus";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { Icons } from "@ui";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: MobileMap;
    playerOperator: PlayerOperator<MobileMap, DocumentPickerResponse, MobileMarkerImageData>
}

export const RecordingButtons: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens, signaliumBureau } = useMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    useEffect(() => {
        const abortController = new AbortController();
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
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
            <Button
                icon={Icons.NounProject.Destroy}
                size="md"
                variant="ghost"
                corners="circle"
                aria-label={destroyLabel}
                tooltip={destroyLabel}
                tooltipPlacement="top"
                onClick={() => chronoLens.destroyRecording()}
                disabled // TODO:
            />
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
                    blinking
                />
            )}
            {surveillanceState === SurveillanceState.Paused ? (
                <Button
                    icon={Icons.NounProject.ResumeRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={pauseRecordingLabel}
                    tooltip={pauseRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecordPause()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.PauseRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={resumeRecordingLabel}
                    tooltip={resumeRecordingLabel}
                    tooltipPlacement="top"
                    onClick={() => playerOperator.onRecordPause()}
                    disabled={surveillanceState === SurveillanceState.Stopped}
                />
            )}
        </>
    );
};
