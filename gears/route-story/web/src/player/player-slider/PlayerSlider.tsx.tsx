import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { MarkerImage, useMachineWard, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../../tinkers";
import { Button, Slider } from "@web-ui";
import { Icons } from "@ui";
import { WebMarkerImageData } from "../../images/image-parser";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import { SliderMarkers } from "./SliderMarkers";
import { PlayerSliderLabels } from "./PlayerSliderLabels";
import styles from './player-slider.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: maplibregl.Map;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    playerOperator: PlayerOperator<maplibregl.Map, File, WebMarkerImageData>;
}

export const PlayerSlider: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens } = useMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [showImageMarkers, setShowImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);
    const [
        sliderLabel,
        playLabel,
        pauseLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Slider },
        { n: gearId, t: translationKey.Play },
        { n: gearId, t: translationKey.Pause },
    ]);
    const playPauseLabel = isPlaying ? pauseLabel : playLabel;

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(
            value,
            (line, currentPoint) => {
                updateRouteLayer(map, line, currentPoint);
            }
        )
    };

    const [
        showImageMarkerLabel,
        hideImageMarkerLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.ShowImageMarkers },
        { n: gearId, t: translationKey.HideImageMarkers },
    ]);

    const markersLabel = showImageMarkers ? hideImageMarkerLabel : showImageMarkerLabel;

    return (
        <div className={styles['container']}>
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
            <div className={styles['slider-container']}>
                <PlayerSliderLabels progressMs$={progressMs$} routeTimes$={routeTimes$} />
                <Slider
                    aria-label={sliderLabel}
                    value={progressMs}
                    min={0}
                    max={routeTimes?.duration ?? 1}
                    step={1}
                    onChange={handleProgressChange}
                    color="tertiary"
                    size="sm"
                />
                {showImageMarkers ? (
                    <SliderMarkers
                        gearId={gearId}
                        translationKey={translationKey}
                        data$={data$}
                        routeTimes$={routeTimes$}
                        images$={images$}
                    />
                ) : null}
            </div>
            <Button
                icon={Icons.NounProject.ImageMarker}
                size="md"
                variant="ghost"
                corners="circle"
                color={showImageMarkers ? 'tertiary' : 'neutral'}
                highlightColor="tertiary"
                aria-label={markersLabel}
                tooltip={markersLabel}
                tooltipPlacement="top"
                onClick={() => setShowImageMarkers((prev) => !prev)}
            />
        </div>
    );
};
