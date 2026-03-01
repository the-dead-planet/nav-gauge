import { FC, useRef, useEffect } from "react";
import { View, Button } from "react-native";
import Slider, { SliderReferenceType } from "@react-native-community/slider";
import { OverlayComponentProps, SurveillanceState, useMachineWard, useStateWarden, useSubjectState } from "@apparatus";
import { formatCurrentTimestamp, getProgressPercentage, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { MobileMap } from "@mobile-ui";
import { useTheme } from "@ui";
import { updateRouteLayer } from "../tinkers";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap>> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const theme = useTheme();
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { individuator } = useMachineWard();
    const { animatrix, chronoLens } = useStateWarden();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying, setIsPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState, setSurveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [downloadName] = useSubjectState(chronoLens.downloadName$);
    const [fps] = useSubjectState(chronoLens.fps$);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (currentPoint, lines) => updateRouteLayer(currentPoint, lines));
    };

    // TODO: 
    // const MobileLens = useMemo(() => new WebChronoLens(individuator), [individuator]);

    // useEffect(() => {
    //     const noticeId = 'player-recording';

    //     const subscription = chronoLens.surveillanceState$
    //         .pipe(pairwise())
    //         .subscribe(([prev, next]) => {
    //             switch (next) {
    //                 case SurveillanceState.Stopped:
    //                     MobileLens.stopRecording();
    //                     break;
    //                 case SurveillanceState.Paused:
    //                     MobileLens.pauseRecording(setIsPlaying);
    //                     break;
    //                 case SurveillanceState.InProgress: {
    //                     if (prev === SurveillanceState.Paused) {
    //                         MobileLens.resumeRecording(setIsPlaying);
    //                     } else {
    //                         MobileLens.startRecording(map.getCanvas(), downloadName, settings, fps, setIsPlaying, setSurveillanceState, (stage, error) => {
    //                             signaliumBureau.addNotice({
    //                                 id: noticeId,
    //                                 type: 'error',
    //                                 error,
    //                                 text: `Something went wrong during the ${stage} stage.`
    //                             });
    //                         });
    //                     }
    //                     break;
    //                 }
    //             }
    //         });

    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // }, []);

    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const getPosition = (featureId: number) => {
        const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
        if (!feature || !routeTimes) {
            return 0;
        }
        return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
    };

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
                {surveillanceState !== SurveillanceState.Stopped ? (
                    <Button
                        title={`${surveillanceState === SurveillanceState.Paused ? 'Resume' : 'Pause'} recording`}
                        color={theme.colors.button}
                        onPress={playerOperator.onRecordPause}
                    />
                ) : null}
                <Button
                    title={'Clear'}
                    color={theme.colors.button}
                    onPress={() => {
                        // WebLens.destroyRecording();
                    }}
                />
                <Text>
                    {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                </Text>
            </View>
        </View>
    );
};
