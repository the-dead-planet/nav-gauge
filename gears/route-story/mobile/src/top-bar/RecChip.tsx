import { FC } from "react";
import { Animated } from "react-native";
import { MobileRouteStoryProps } from "../model";
import { Chip, useBlinkingPulse } from "@mobile-ui";
import { useMultipleTranslations } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";

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
            <Chip
                color={playerOperator.getBlinkingColor(surveillanceState)}
                onPress={() => playerOperator.onStop()}
                tooltip={stopRecordingLabel}
            >
                REC
            </Chip>
        </Animated.View>
    );
};
