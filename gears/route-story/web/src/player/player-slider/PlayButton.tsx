import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@web-ui";
import { Icons } from "@ui";
import { WebPlayerOperator } from "../../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    playerOperator: WebPlayerOperator;
}

export const PlayButton: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens } = useWebMachineWard();
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
            aria-label={playPauseLabel}
            tooltip={playPauseLabel}
            tooltipPlacement="top"
            onClick={() => playerOperator.onPlay()}
        />
    );
};
