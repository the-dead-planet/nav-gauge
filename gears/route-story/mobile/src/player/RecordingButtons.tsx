import { FC, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SurveillanceState, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@mobile-ui";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { Icons } from "@ui";
import { MobilePlayerOperator } from "../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: MobileMap;
    playerOperator: MobilePlayerOperator;
}

export const RecordingButtons: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens, signaliumBureau } = useMobileMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [hasRecordingData] = useSubjectState(chronoLens.hasRecordingData$);

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

    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 450, useNativeDriver: true }),
            ])
        );
        blinkAnimation.start();
        return () => blinkAnimation.stop();
    }, [opacity]);

    return (
        <>
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
                <Animated.View style={{ opacity }}>
                    <Button
                        icon={Icons.NounProject.Recording}
                        size="md"
                        variant="ghost"
                        corners="circle"
                        aria-label={stopRecordingLabel}
                        tooltip={stopRecordingLabel}
                        tooltipPlacement="top"
                        onClick={() => playerOperator.onRecord()}
                    />
                </Animated.View>
            )}
            {surveillanceState === SurveillanceState.Paused ? (
                <Button
                    icon={Icons.NounProject.PauseRecording}
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
                    icon={Icons.NounProject.ResumeRecording}
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
            <Button
                icon={Icons.NounProject.Destroy}
                size="md"
                variant="ghost"
                corners="circle"
                aria-label={destroyLabel}
                tooltip={destroyLabel}
                tooltipPlacement="top"
                onClick={() => playerOperator.onDestroy()}
                disabled={!hasRecordingData}
            />
        </>
    );
};
