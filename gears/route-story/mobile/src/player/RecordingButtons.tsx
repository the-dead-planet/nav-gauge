import { FC } from "react";
import { Animated, StyleSheet } from "react-native";
import { SurveillanceState, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, useBlinkingPulse } from "@mobile-ui";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { Icons } from "@ui";
import { MobilePlayerOperator } from "../model";

const styles = StyleSheet.create({
    button: {
        flexShrink: 1,
        minWidth: 0,
    },
    animatedButton: {
        flexDirection: "row",
        flexShrink: 1,
        minWidth: 0,
    },
});

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
    const { chronoLens } = useMobileMachineWard();
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

    const opacity = useBlinkingPulse();

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
                    style={styles.button}
                    tooltip={startRecordingLabel}
                    tooltipPlacement="top"
                    onPress={() => playerOperator.onStart()}
                />
            ) : (
                <Animated.View style={[styles.animatedButton, { opacity }]}>
                    <Button
                        icon={Icons.NounProject.Recording}
                        size="md"
                        variant="ghost"
                        color={surveillanceState === SurveillanceState.InProgress ? "secondary" : "neutral"}
                        corners="circle"
                        aria-label={stopRecordingLabel}
                        caption={stopCaption}
                        style={styles.button}
                        tooltip={stopRecordingLabel}
                        tooltipPlacement="top"
                        onPress={() => playerOperator.onStop()}
                    />
                </Animated.View>
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
                    style={styles.button}
                    tooltip={resumeRecordingLabel}
                    tooltipPlacement="top"
                    onPress={() => playerOperator.onResume()}
                />
            ) : (
                <Button
                    icon={Icons.NounProject.PauseRecording}
                    size="md"
                    variant="ghost"
                    corners="circle"
                    aria-label={pauseRecordingLabel}
                    caption={pauseCaption}
                    style={styles.button}
                    tooltip={pauseRecordingLabel}
                    tooltipPlacement="top"
                    onPress={() => playerOperator.onPause()}
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
                style={styles.button}
                tooltip={destroyLabel}
                tooltipPlacement="top"
                onPress={() => playerOperator.onDestroy()}
                disabled={!hasRecordingData}
            /> */}
        </>
    );
};
