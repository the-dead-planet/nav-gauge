import { FC } from "react";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage, useMachineWard, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, Slider } from "@mobile-ui";
import { Icons } from "@ui";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { currentPointRef$, linesRef$ } from "../../layers/RouteLayer";
import { SliderMarkers } from "./SliderMarkers";
import { PlayerSliderLabels } from "./PlayerSliderLabels";
import { MobileMarkerImageData } from "../../images/image-parser";
import { MobileMap } from "@mobile-apparatus";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: MobileMap;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    playerOperator: PlayerOperator<MobileMap, DocumentPickerResponse, MobileMarkerImageData>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    sliderContainer: {
        flex: 1,
        gap: 4,
    },
    sliderWrapper: {
        justifyContent: 'center',
    },
});

export const PlayerSlider: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens } = useMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [showImageMarkers, setShowImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);
    const [
        playLabel,
        pauseLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Play },
        { n: gearId, t: translationKey.Pause },
    ]);
    const playPauseLabel = isPlaying ? pauseLabel : playLabel;

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (line, currentPoint) => {
            linesRef$.next(line);
            currentPointRef$.next(currentPoint);
        });
    };

    const [
        showImageMarkerLabel,
        hideImageMarkerLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.ShowImageMarkers },
        { n: gearId, t: translationKey.HideImageMarkers },
    ]);

    const markersLabel = showImageMarkers ? hideImageMarkerLabel : showImageMarkerLabel;

    return (
        <View style={styles.container}>
            <Button
                icon={isPlaying ? Icons.Pause : Icons.Play}
                size="md"
                variant="outline"
                color="secondary"
                corners="circle"
                accessibilityLabel={playPauseLabel}
                tooltip={playPauseLabel}
                tooltipPlacement="top"
                onPress={() => playerOperator.onPlay()}
            />
            <View style={styles.sliderContainer}>
                <PlayerSliderLabels progressMs$={progressMs$} routeTimes$={routeTimes$} />
                <View style={styles.sliderWrapper}>
                    <Slider
                        value={progressMs}
                        min={0}
                        max={routeTimes?.duration ?? 1}
                        step={1}
                        onChange={handleProgressChange}
                        color="tertiary"
                        size="sm"
                    />
                    {showImageMarkers ? (
                        <SliderMarkers
                            gearId={gearId}
                            translationKey={translationKey}
                            data$={data$}
                            routeTimes$={routeTimes$}
                            images$={images$}
                        />
                    ) : null}
                </View>
            </View>
            <Button
                icon={Icons.NounProject.ImageMarker}
                size="md"
                variant="ghost"
                corners="circle"
                color={showImageMarkers ? 'tertiary' : 'neutral'}
                highlightColor="tertiary"
                accessibilityLabel={markersLabel}
                tooltip={markersLabel}
                tooltipPlacement="top"
                onPress={() => setShowImageMarkers((prev) => !prev)}
            />
        </View>
    );
};
