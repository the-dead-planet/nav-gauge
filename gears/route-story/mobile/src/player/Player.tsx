import { FC, useRef, useEffect } from "react";
import { View, Button } from "react-native";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import Slider, { SliderReferenceType } from "@react-native-community/slider";
import { OverlayComponentProps, SurveillanceState, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { formatCurrentTimestamp, getProgressPercentage, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { MobileMap } from "@mobile-ui";
import { useTheme } from "@ui";
import { currentPointRef$, linesRef$ } from "../layers/RouteLayer";
import { MobileMarkerImageData } from "../images/image-parser";
import { RouteStoryFileInput } from "../RouteStoryFileInput";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    data$,
    routeTimes$,
    progressMs$,
    fileOperator,
    playerOperator,
}) => {
    const theme = useTheme();
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, individuator } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (line, currentPoint) => {
            linesRef$.next(line);
            currentPointRef$.next(currentPoint);
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
            <RouteStoryFileInput data$={data$} fileOperator={fileOperator}/>
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
                    color={theme.componentColor('button')}
                    onPress={playerOperator.onPlay}
                />
                <Button
                    title={`${surveillanceState === SurveillanceState.Stopped ? 'Start' : 'Stop'} recording`}
                    color={theme.componentColor('button')}
                    onPress={playerOperator.onRecord}
                />
                <Text>
                    {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                </Text>
            </View>
        </View>
    );
};
