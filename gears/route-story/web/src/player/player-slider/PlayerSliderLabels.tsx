import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useWebMachineWard } from "@web-apparatus";
import { formatDistance, formatTimeMsAsStandard, ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { Animatrix, getProgressPercentage, getRouteDistanceFraction, RouteTimes, RouteGeometryData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@web-ui";
import { FontType, useTheme } from "@ui";
import styles from './player-slider-labels.module.css';

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    progressMs$: BehaviorSubject<number>;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    animatrix: Animatrix;
}

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
    const { individuator } = useWebMachineWard();
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
        <div className={styles['container']}>
            <div className={styles.metrics}>
                <Text variant="caption" fontType={FontType.Numeric} color="tertiary" tabular nowrap style={{ width: '4ch' }}>
                    {progressPercentage.toFixed(0)}%
                </Text>
                {values.map(({ value, maximum }) => (
                    <Text key={maximum} variant="caption" fontType={FontType.Numeric} color="tertiary" tabular nowrap style={{ width: `${maximum.length}ch` }}>{value}</Text>
                ))}
            </div>
            <Text variant="caption" fontType={FontType.Numeric} color="tertiary" tabular nowrap className={styles['align-flex-right']}>
                {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings, { short: media.isLessThanMd })}
            </Text>
        </div>
    );
};
