import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes, Animatrix, RouteGeometryData, getRouteDistanceFraction, getRouteTimelinePositionForDistanceFraction } from "@the-dead-planet/nav-gauge-gears-route-story-common";
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
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
    progressMs$: BehaviorSubject<number>;
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
    routeGeometryData$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
    animatrix,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);

    const handleProgressChange = (value: number) => {
        const nextProgressMs = animationControls.playbackPacing === 'distance' && geojson && routeGeometryData && routeTimes
            ? getRouteTimelinePositionForDistanceFraction(geojson, routeGeometryData, routeTimes.startTimeEpoch, value / Math.max(routeGeometryData.totalDistanceMeters, 1))
            : value;
        playerOperator.updateProgress(nextProgressMs, (line, currentPoint) => {
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
                    routeGeometryData$={routeGeometryData$}
                    routeTimes$={routeTimes$}
                    images$={images$}
                    animatrix={animatrix}
                />
            ) : null}
            <Slider
                value={animationControls.playbackPacing === 'distance'
                    ? getRouteDistanceFraction(progressMs, geojson, routeTimes, routeGeometryData) * (routeGeometryData?.totalDistanceMeters ?? 1)
                    : progressMs}
                min={0}
                max={animationControls.playbackPacing === 'distance' ? Math.max(routeGeometryData?.totalDistanceMeters ?? 0, 1) : routeTimes?.duration ?? 1}
                step={1}
                onChange={handleProgressChange}
                color="tertiary"
                size="sm"
            />
            <PlayerSliderLabels data$={data$} routeGeometryData$={routeGeometryData$} progressMs$={progressMs$} routeTimes$={routeTimes$} animatrix={animatrix} />
        </View>
    );
};
