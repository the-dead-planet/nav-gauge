import { CSSProperties, FC } from "react";
import { ToolPanelProps, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { getProgressPercentage, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../tinkers";
import { Button, Checkbox, Divider, P, Slider } from "@web-ui";
import { FontType, formatTimeMsAsStandard, Icons } from "@ui";
import { WebMarkerImageData } from "../images/image-parser";
import { RecordingButtons } from "./RecordingButtons";
import styles from './player.module.css';
import { ConfigurationButtons } from "./ConfigurationButtons";

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
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, individuator } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(
            value,
            (line, currentPoint) => {
                updateRouteLayer(map, line, currentPoint);
            }
        )
    };

    const getPosition = (featureId: number) => {
        const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
        if (!feature || !routeTimes) {
            return 0;
        }
        return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
    };

    return (
        <div className={styles.player}>
            <RecordingButtons gearId={gearId} translationKey={translationKey} map={map} playerOperator={playerOperator} />
            <Divider color="neutral" orientation="vertical" mh="xs" />
            <Button
                icon={isPlaying ? Icons.Pause : Icons.Play}
                size="md"
                variant="outline"
                color="secondary"
                corners="circle"
                aria-label="TODO: Play payse"
                tooltip="TODO: Play/Pause"
                tooltipPlacement="top"
                onClick={() => playerOperator.onPlay()}
            />
            <div style={{ flex: 1, display: 'grid' }}>
                <div style={{ display: 'flex', columnGap: "10px" }}>
                    <P fontType={FontType.Numeric} color="tertiary" className={styles.text} style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                        {formatTimeMsAsStandard(progressMs)}
                    </P>
                    <P fontType={FontType.Numeric} color="tertiary" className={styles.text} style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                        {progressPercentage.toFixed(0)}%
                    </P>
                    <P fontType={FontType.Numeric} color="tertiary" className={styles.text} style={{ fontSize: '12px', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
                        {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                    </P>
                </div>
                {/* <div className={styles.pictures}>
                    {images
                        .filter((image) => image.featureId !== undefined)
                        .map((image) => (
                            <span key={image.id} className={styles['image-marker']} style={{ left: `${getPosition(image.featureId!).toFixed(0)}%` }} />
                        ))}
                </div> */}
                <Slider
                    aria-label="TODO: Slider"
                    value={progressMs}
                    min={0}
                    max={routeTimes?.duration ?? 1}
                    step={1}
                    onChange={handleProgressChange}
                    color="tertiary"
                    size="sm"
                    style={{ flex: 1 } as CSSProperties}
                />
            </div>
            <Divider color="neutral" orientation="vertical" mh="sm" />
            <ConfigurationButtons
                gearId={gearId}
                translationKey={translationKey}
                animatrix={animatrix}
                state$={state$}
            />
        </div>
    );
};
