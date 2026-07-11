import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { getProgressPercentage, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { P } from "@web-ui";
import { FontType, formatTimeMsAsStandard } from "@ui";
import styles from './player-slider-labels.module.css';

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    progressMs$: BehaviorSubject<number>;
}

export const PlayerSliderLabels: FC<Props> = ({
    routeTimes$,
    progressMs$,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { individuator } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    return (
        <div className={styles['container']}>
            <P fontType={FontType.Numeric} color="tertiary" className={styles.text} >
                {formatTimeMsAsStandard(progressMs)}
            </P>
            <P fontType={FontType.Numeric} color="tertiary" className={styles.text}>
                {progressPercentage.toFixed(0)}%
            </P>
            <P fontType={FontType.Numeric} color="tertiary" className={classNames(styles.text, styles['align-flex-right'])}>
                {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
            </P>
        </div>
    );
};
