import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@web-ui";
import { Icons } from "@ui";
import { WebMarkerImageData } from "../../images/image-parser";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    playerOperator: PlayerOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const PlayButton: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const { chronoLens } = useMachineWard();
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
