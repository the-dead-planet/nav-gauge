import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import classNames from "classnames";
import { ToolPanelProps } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Divider } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { RecordingButtons } from "./RecordingButtons";
import { ConfigurationButtons } from "./ConfigurationButtons";
import { useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { PlayButton } from "./player-slider/PlayButton";
import { SliderWithMarkers } from "./player-slider/SliderWithMarkers";
import { MarkerButton } from "./player-slider/MarkerButton";
import styles from './player.module.css';

export const Player: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    gearId,
    translationKey,
    map,
    data$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);

    const recordingButtons = (
        <RecordingButtons
            gearId={gearId}
            translationKey={translationKey}
            map={map}
            playerOperator={playerOperator}
        />
    );
    const playButton = <PlayButton gearId={gearId} translationKey={translationKey} playerOperator={playerOperator} />;
    const sliderWithMarkers = (
        <SliderWithMarkers
            gearId={gearId}
            translationKey={translationKey}
            map={map}
            data$={data$}
            routeTimes$={routeTimes$}
            images$={images$}
            progressMs$={progressMs$}
            playerOperator={playerOperator}
        />
    );
    const markerButton = <MarkerButton gearId={gearId} translationKey={translationKey} playerOperator={playerOperator} />;
    const configurationButtons = <ConfigurationButtons gearId={gearId} translationKey={translationKey} state$={state$} />;

    if (media.isLessThanMd) {
        return (
            <div className={classNames(styles.player, styles.sm)}>
                <div className={styles.buttons}>
                    <div>
                        {recordingButtons}
                    </div>
                    {playButton}
                    <div>
                        {markerButton}
                        {configurationButtons}
                    </div>
                </div>
                <div className={styles['slider']}>
                    {sliderWithMarkers}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.player}>
            {recordingButtons}
            <Divider color="neutral" orientation="vertical" mh="xs" mv="lg" />
            <div className={styles['slider']}>
                {playButton}
                {sliderWithMarkers}
                {markerButton}
            </div>
            <Divider color="neutral" orientation="vertical" mh="sm" mv="lg" />
            {configurationButtons}
        </div>
    );
};
