import { FC, useRef, useEffect } from "react";
import { View, Button } from "react-native";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { OverlayComponentProps, SurveillanceState, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { formatCurrentTimestamp, getProgressPercentage, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Slider, Text } from "@mobile-ui";
import { MobileMap } from "@mobile-ui";
import { useTheme } from "@ui";
import { currentPointRef$, linesRef$ } from "../layers/RouteLayer";
import { MobileMarkerImageData } from "../images/image-parser";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    routeTimes$,
    progressMs$,
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

    const sliderRef = useRef<any>(null);

    useEffect(() => {
        sliderRef.current?.setNativeProps({ value: progressMs })
    }, [progressMs]);

    return (
        <View style={{ flex: 1 }}>
            <Slider
                ref={sliderRef}
                min={0}
                max={routeTimes?.duration ?? 1}
                step={1}
                value={progressMs}
                onChange={handleProgressChange}
                color="tertiary"
                size="sm"
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
