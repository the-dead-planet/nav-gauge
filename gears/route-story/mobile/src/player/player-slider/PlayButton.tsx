import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@mobile-ui";
import { Icons } from "@ui";
import { MobilePlayerOperator } from "../../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    playerOperator: MobilePlayerOperator;
}

export const PlayButton: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens } = useMobileMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [
        playLabel,
        pauseLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Play },
        { n: gearId, t: translationKey.Pause },
    ]);
    const playPauseLabel = isPlaying ? pauseLabel : playLabel;

    return (
        <Button
            icon={isPlaying ? Icons.Pause : Icons.Play}
            size="md"
            variant="outline"
            color="secondary"
            corners="circle"
            accessibilityLabel={playPauseLabel}
            tooltip={playPauseLabel}
            tooltipPlacement="top"
            onPress={() => playerOperator.onPlay()}
        />
    );
};
