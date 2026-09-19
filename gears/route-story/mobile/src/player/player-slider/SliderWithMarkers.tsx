import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes, Animatrix, RouteStoryState, requiresSplitLineGeometry } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Slider } from "@mobile-ui";
import { currentPointRef$, linesRef$, routeDistanceFractionRef$ } from "../../layers/RouteLayer";
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
    routeTimelinePositionMs$: BehaviorSubject<number>;
    playerOperator: MobilePlayerOperator;
    animatrix: Animatrix;
    state$: BehaviorSubject<RouteStoryState>;
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
    state$,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);

    const handleRouteTimelinePositionChange = (value: number) => {
        playerOperator.updateRouteTimelinePosition(value, (line, currentPoint, routeDistanceFraction) => {
            if (requiresSplitLineGeometry(state$.value)) {
                linesRef$.next(line);
            }
            routeDistanceFractionRef$.next(routeDistanceFraction);
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
