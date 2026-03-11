import { FC, useRef, useEffect, useState } from "react";
import { View, Button } from "react-native";
import { useViewRecorder, ViewRecorder } from "react-native-view-recorder";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import Slider, { SliderReferenceType } from "@react-native-community/slider";
import { OverlayComponentProps, SurveillanceState, useMachineWard, useStateWarden, useSubjectState } from "@apparatus";
import { formatCurrentTimestamp, getProgressPercentage, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { MobileMap } from "@mobile-ui";
import { useTheme } from "@ui";
import { currentPointRef$, linesRef$ } from "../RouteLayer";
import { MobileChronoLens } from "../../../../../app-mobile/src/chrono-lens";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse>> = ({
    map,
    routeTimes$,
    progressMs$,
    playerOperator,
}) => {
    const theme = useTheme();
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { individuator } = useMachineWard();
    const { chronoLens, signaliumBureau } = useStateWarden();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (currentPoint, lines) => {
            linesRef$.value?.current?.setNativeProps({ shape: lines });
            currentPointRef$.value?.current?.setNativeProps({ shape: currentPoint });
        });
    };

    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const sliderRef = useRef<Slider | null>(null);

    useEffect(() => {
        // When passed to props animation slows down.
        sliderRef.current?.setNativeProps({ value: progressMs })
    }, [progressMs]);

    return (
        <View style={{ flex: 1 }}>
            <Slider
                ref={sliderRef as SliderReferenceType}
                minimumValue={0}
                maximumValue={routeTimes?.duration ?? 1}
                step={1}
                onValueChange={handleProgressChange}
                style={{ height: 40 }}
                minimumTrackTintColor="#0000FF"
                maximumTrackTintColor="#000000"
                thumbTintColor="gray"
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
            }}>
                <Text>
                    {formatCurrentTimestamp(progressMs, progressPercentage)}
                </Text>
                <Button
                    title={isPlaying ? 'Pause' : 'Play'}
                    color={theme.colors.button}
                    onPress={playerOperator.onPlay}
                />
                <Button
                    title={`${surveillanceState === SurveillanceState.Stopped ? 'Start' : 'Stop'} recording`}
                    color={theme.colors.button}
                    onPress={playerOperator.onRecord}
                />
                <Text>
                    {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                </Text>
            </View>
        </View>
    );
};
