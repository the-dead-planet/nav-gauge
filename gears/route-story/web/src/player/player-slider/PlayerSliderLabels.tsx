import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { getRouteTimelinePercentage, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { P } from "@web-ui";
import { FontType, formatTimeMsAsStandard, useTheme } from "@ui";
import styles from './player-slider-labels.module.css';

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    routeTimelinePositionMs$: BehaviorSubject<number>;
}

export const PlayerSliderLabels: FC<Props> = ({
    routeTimes$,
    routeTimelinePositionMs$,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const { individuator } = useWebMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const routeTimelinePercentage = getRouteTimelinePercentage(routeTimelinePositionMs, routeTimes);

    return (
        <div className={styles['container']}>
            <P fontType={FontType.Numeric} color="tertiary" className={styles.text} >
                {formatTimeMsAsStandard(routeTimelinePositionMs)}
            </P>
            <P fontType={FontType.Numeric} color="tertiary" className={styles.text}>
                {routeTimelinePercentage.toFixed(0)}%
            </P>
            <P fontType={FontType.Numeric} color="tertiary" className={classNames(styles.text, styles['align-flex-right'])}>
                {!routeTimes ? "" : individuator.formatTimestamp(routeTimelinePositionMs + routeTimes.startTimeEpoch, settings, { short: media.isLessThanMd })}
            </P>
        </div>
    );
};
