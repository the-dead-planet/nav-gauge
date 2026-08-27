import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { getProgressPercentage, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Text } from "@mobile-ui";
import { FontType, formatTimeMsAsStandard, useTheme } from "@ui";

interface Props {
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    progressMs$: BehaviorSubject<number>;
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
    progressMs$,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { individuator } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    return (
        <View style={styles.container}>
            <Text variant="caption" fontType={FontType.Numeric} color="tertiary">
                {formatTimeMsAsStandard(progressMs)}
            </Text>
            <Text variant="caption" fontType={FontType.Numeric} color="tertiary">
                {progressPercentage.toFixed(0)}%
            </Text>
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
