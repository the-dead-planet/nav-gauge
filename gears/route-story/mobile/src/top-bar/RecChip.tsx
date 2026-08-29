import { FC, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { MobileRouteStoryProps } from "../model";
import { Chip } from "@mobile-ui";
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
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 450, useNativeDriver: true }),
            ])
        );
        blinkAnimation.start();

        return () => {
            blinkAnimation.stop();
        };
    }, [opacity]);

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
