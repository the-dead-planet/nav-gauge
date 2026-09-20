import { FC } from "react";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import { Dropdown, Label } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { StyleSheet, View } from "react-native";
import { MobileRouteStoryProps } from "../model";

const styles = StyleSheet.create({
    control: {
        gap: 4,
    },
});

export const AnimationControls: FC<ToolPanelProps<MobileMap> & MobileRouteStoryProps> = ({ animatrix }) => {
    const [controls, setControls] = useSubjectState(animatrix.controls$);
    const [playbackPacingLabel, timelinePacingLabel, distancePacingLabel] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.PlaybackPacing },
        { n: animatrix.namespace, t: animatrix.translationKey.TimelinePacing },
        { n: animatrix.namespace, t: animatrix.translationKey.DistancePacing },
    ]);

    return (
        <View style={styles.control}>
            <Label>{playbackPacingLabel}</Label>
            <Dropdown
                size="xs"
                value={controls.playbackPacing}
                options={[
                    { value: 'timeline' as const, label: timelinePacingLabel },
                    { value: 'distance' as const, label: distancePacingLabel },
                ]}
                onChange={(playbackPacing) => setControls((previous) => ({ ...previous, playbackPacing }))}
            />
        </View>
    );
};
