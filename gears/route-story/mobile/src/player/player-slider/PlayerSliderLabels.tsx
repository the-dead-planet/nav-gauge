import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { getRouteTimelinePercentage, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { FontType, formatTimeMsAsStandard, useTheme } from "@ui";

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    routeTimelinePositionMs$: BehaviorSubject<number>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },
    end: {
        marginLeft: 'auto',
    },
});

export const PlayerSliderLabels: FC<Props> = ({
    routeTimes$,
    routeTimelinePositionMs$,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const { individuator } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const routeTimelinePercentage = getRouteTimelinePercentage(routeTimelinePositionMs, routeTimes);

    return (
        <View style={styles.container}>
            <Text variant="caption" fontType={FontType.Numeric} color="tertiary">
                {formatTimeMsAsStandard(routeTimelinePositionMs)}
            </Text>
            <Text variant="caption" fontType={FontType.Numeric} color="tertiary">
                {routeTimelinePercentage.toFixed(0)}%
            </Text>
            <Text
                variant="caption"
                fontType={FontType.Numeric}
                color="tertiary"
                style={styles.end}
            >
                {!routeTimes ? "" : individuator.formatTimestamp(routeTimelinePositionMs + routeTimes.startTimeEpoch, settings, { short: media.isLessThanMd })}
            </Text>
        </View>
    );
};
