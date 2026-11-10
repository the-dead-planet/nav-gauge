import { FC } from "react";
import { Animated, Pressable } from "react-native";
import { MobileRouteStoryProps } from "../model";
import { Chip, useBlinkingPulse } from "@mobile-ui";
import { useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useMobileMachineWard } from "@mobile-apparatus";

export const RecChip: FC<MobileRouteStoryProps> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens } = useMobileMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const opacity = useBlinkingPulse();

    const [
        stopRecordingLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.StopRecording },
    ]);

    return (
        <Animated.View style={{ opacity }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={stopRecordingLabel}
                onPress={() => playerOperator.onStop()}
            >
                <Chip
                    variant="fill"
                    size="md"
                    color={playerOperator.getBlinkingColor(surveillanceState)}
                    tooltip={stopRecordingLabel}
                >
                    REC
                </Chip>
            </Pressable>
        </Animated.View>
    );
};
