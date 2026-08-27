import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Slider } from "@mobile-ui";
import { currentPointRef$, linesRef$ } from "../../layers/RouteLayer";
import { SliderMarkers } from "./SliderMarkers";
import { PlayerSliderLabels } from "./PlayerSliderLabels";
import { MobileMarkerImageData } from "../../images/image-parser";
import { MobileMap } from "@mobile-apparatus";
import { MobilePlayerOperator } from "../../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: MobileMap;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    playerOperator: MobilePlayerOperator;
}

const styles = StyleSheet.create({
    sliderContainer: {
        flex: 1,
        gap: 18,
        paddingTop: 11,
    },
});

export const SliderWithMarkers: FC<Props> = ({
    gearId,
    translationKey,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (line, currentPoint) => {
            linesRef$.next(line);
            currentPointRef$.next(currentPoint);
        });
    };

    return (
        <View style={styles.sliderContainer}>
            {showImageMarkers ? (
                <SliderMarkers
                    gearId={gearId}
                    translationKey={translationKey}
                    data$={data$}
                    routeTimes$={routeTimes$}
                    images$={images$}
                />
            ) : null}
            <Slider
                value={progressMs}
                min={0}
                max={routeTimes?.duration ?? 1}
                step={1}
                onChange={handleProgressChange}
                color="tertiary"
                size="sm"
            />
            <PlayerSliderLabels progressMs$={progressMs$} routeTimes$={routeTimes$} />
        </View>
    );
};
