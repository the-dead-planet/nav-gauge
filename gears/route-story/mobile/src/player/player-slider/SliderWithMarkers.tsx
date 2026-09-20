import { FC } from "react";
import { StyleSheet, unstable_batchedUpdates, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes, Animatrix } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Slider } from "@mobile-ui";
import { currentPointRef$, linesRef$, routeDistanceFractionRef$ } from "../../layers/RouteLayer";
import { SliderMarkers } from "./SliderMarkers";
import { PlayerSliderLabels } from "./PlayerSliderLabels";
import { MobileMarkerImageData } from "../../images/image-parser";
import { MobilePlayerOperator } from "../../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
    routeTimelinePositionMs$: BehaviorSubject<number>;
    playerOperator: MobilePlayerOperator;
    animatrix: Animatrix;
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
    routeTimelinePositionMs$,
    playerOperator,
    animatrix,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);

    const handleRouteTimelinePositionChange = (value: number) => {
        playerOperator.updateRouteTimelinePosition(value, (line, currentPoint, routeDistanceFraction) => {
            unstable_batchedUpdates(() => {
                linesRef$.next(line);
                routeDistanceFractionRef$.next(routeDistanceFraction);
                currentPointRef$.next(currentPoint);
            }, undefined);
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
                    animatrix={animatrix}
                />
            ) : null}
            <Slider
                value={routeTimelinePositionMs}
                min={0}
                max={routeTimes?.duration ?? 1}
                step={1}
                onChange={handleRouteTimelinePositionChange}
                color="tertiary"
                size="sm"
            />
            <PlayerSliderLabels routeTimelinePositionMs$={routeTimelinePositionMs$} routeTimes$={routeTimes$} />
        </View>
    );
};
