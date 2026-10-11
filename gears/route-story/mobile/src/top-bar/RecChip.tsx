import { FC } from "react";
import { Animated } from "react-native";
import { MobileRouteStoryProps } from "../model";
import { Button, useBlinkingPulse } from "@mobile-ui";
import { useMultipleTranslations } from "@apparatus";

export const RecChip: FC<MobileRouteStoryProps> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const opacity = useBlinkingPulse();

    const [
        stopRecordingLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.StopRecording },
    ]);

    return (
        <Animated.View style={{ opacity }}>
            <Button
                onPress={() => playerOperator.onStop()}
                tooltip={stopRecordingLabel}
                title="REC"
            />
        </Animated.View>
    );
};
