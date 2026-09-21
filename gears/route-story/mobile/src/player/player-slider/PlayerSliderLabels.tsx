import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { useMobileMachineWard } from "@mobile-apparatus";
import { formatDistance, formatTimeMsAsStandard, ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { Animatrix, getProgressPercentage, getRouteDistanceFraction, RouteTimes, RouteGeometryData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { FontType, useTheme } from "@ui";

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    progressMs$: BehaviorSubject<number>;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    animatrix: Animatrix;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },
    metrics: {
        flexDirection: 'row',
        gap: 10,
    },
    percentage: {
        width: 32,
    },
    end: {
        marginLeft: 'auto',
    },
});

export const PlayerSliderLabels: FC<Props> = ({
    routeTimes$,
    progressMs$,
    data$,
    routeGeometryData$,
    animatrix,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const { individuator } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const distanceFraction = getRouteDistanceFraction(progressMs, geojson, routeTimes, routeGeometryData);
    const progressPercentage = animationControls.playbackPacing === 'distance'
        ? distanceFraction * 100
        : getProgressPercentage(progressMs, routeTimes);
    const duration = formatTimeMsAsStandard(progressMs);
    const distance = formatDistance(distanceFraction * (routeGeometryData?.totalDistanceMeters ?? 0), settings.distanceUnit, settings.locale);
    const maximumDuration = formatTimeMsAsStandard(routeTimes?.duration ?? 0);
    const maximumDistance = formatDistance(routeGeometryData?.totalDistanceMeters ?? 0, settings.distanceUnit, settings.locale);
    const values = animationControls.playbackPacing === 'distance'
        ? [{ value: distance, maximum: maximumDistance }, { value: duration, maximum: maximumDuration }]
        : [{ value: duration, maximum: maximumDuration }, { value: distance, maximum: maximumDistance }];

    return (
        <View style={styles.container}>
            <View style={styles.metrics}>
                <Text variant="caption" fontType={FontType.Numeric} color="tertiary" style={styles.percentage}>
                    {progressPercentage.toFixed(0)}%
                </Text>
                {values.map(({ value, maximum }) => (
                    <Text key={maximum} variant="caption" fontType={FontType.Numeric} color="tertiary" style={{ width: maximum.length * 7 }}>{value}</Text>
                ))}
            </View>
            <Text
                variant="caption"
                fontType={FontType.Numeric}
                color="tertiary"
                style={styles.end}
            >
                {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings, { short: media.isLessThanMd })}
            </Text>
        </View>
    );
};
