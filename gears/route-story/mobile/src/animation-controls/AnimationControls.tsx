import { FC } from "react";
import { ToolPanelProps, useTranslate, useTranslation } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import { Dropdown, Label } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { StyleSheet, View } from "react-native";
import { MobileRouteStoryProps } from "../model";
import { Animatrix } from "@the-dead-planet/nav-gauge-gears-route-story-common";

const styles = StyleSheet.create({
    control: {
        gap: 4,
    },
});

export const AnimationControls: FC<ToolPanelProps<MobileMap> & MobileRouteStoryProps> = ({ animatrix }) => {
    const [controls, setControls] = useSubjectState(animatrix.controls$);
    const playbackPacingLabel = useTranslation({ n: animatrix.namespace, t: animatrix.translationKey.PlaybackPacing });
    const translate = useTranslate();

    return (
        <View style={styles.control}>
            <Label>{playbackPacingLabel}</Label>
            <Dropdown
                size="xs"
                value={controls.playbackPacing}
                options={Animatrix.playbackPacingOptions.map(({ value, translationKey }) => ({
                    value,
                    label: translate({ n: animatrix.namespace, t: translationKey }),
                }))}
                onChange={(playbackPacing) => setControls((previous) => ({ ...previous, playbackPacing }))}
            />
        </View>
    );
};
