import { FC } from "react";
import { ToolPanelProps } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Divider } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { RecordingButtons } from "./RecordingButtons";
import { ConfigurationButtons } from "./ConfigurationButtons";
import { PlayerSlider } from "./player-slider/PlayerSlider.tsx";
import styles from './player.module.css';

export const Player: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    gearId,
    translationKey,
    map,
    animatrix,
    data$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    return (
        <div className={styles.player}>
            <RecordingButtons
                gearId={gearId}
                translationKey={translationKey}
                map={map}
                playerOperator={playerOperator}
            />
            <Divider color="neutral" orientation="vertical" mh="xs" />
            <PlayerSlider
                gearId={gearId}
                translationKey={translationKey}
                map={map}
                data$={data$}
                routeTimes$={routeTimes$}
                images$={images$}
                progressMs$={progressMs$}
                playerOperator={playerOperator}
            />
            <Divider color="neutral" orientation="vertical" mh="sm" />
            <ConfigurationButtons
                gearId={gearId}
                translationKey={translationKey}
                map={map}
                animatrix={animatrix}
                state$={state$}
            />
        </div>
    );
};
