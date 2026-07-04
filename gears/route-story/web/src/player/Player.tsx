import { ChangeEvent, CSSProperties, FC, useEffect } from "react";
import { SurveillanceState, ToolPanelProps, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { formatCurrentTimestamp, getProgressPercentage, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../tinkers";
import { WebChronoLens } from "@web-apparatus";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './player.module.css';
import { Button, Checkbox, P } from "@web-ui";
import { FontType, formatTimeMsAsStandard, Icons } from "@ui";

export const Player: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    data$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [state, setState] = useSubjectState(state$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, signaliumBureau, individuator } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    useEffect(() => {
        const abortController = new AbortController();
        (chronoLens as WebChronoLens).canvas = map.getCanvas();
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
            chronoLens.clearSurveillance();
        };
    }, []);

    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
        playerOperator.updateProgress(
            Number(event.target.value),
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
            {/* TODO: Icons */}
            <Button
                icon={surveillanceState === SurveillanceState.Stopped ? Icons.RecordCapture : Icons.Stop}
                size="md"
                variant="ghost"
                color="secondary"
                corners="circle"
                aria-label="TODO: Record/StopRecord"
                tooltip="TODO: Record/StopRecord"
                onClick={playerOperator.onRecord}
            />
            {surveillanceState !== SurveillanceState.Stopped ? (
                <Button
                    icon={surveillanceState === SurveillanceState.Paused ? Icons.Play : Icons.Pause}
                    size="md"
                    variant="outline"
                    color="secondary"
                    corners="circle"
                    aria-label="TODO: Pause record"
                    tooltip="TODO: Pause erecord"
                    onClick={playerOperator.onRecordPause}
                />
            ) : null}
            <Button
                icon={isPlaying ? Icons.Pause : Icons.Play}
                size="md"
                variant="outline"
                color="secondary"
                corners="circle"
                aria-label="TODO: Play payse"
                tooltip="TODO: Play/Pause"
                onClick={playerOperator.onPlay}
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
                <input
                    type="range"
                    value={progressMs}
                    min={0}
                    max={routeTimes?.duration ?? 1}
                    step={1}
                    onChange={handleProgressChange}
                    // TODO: Fix styles for all browsers
                    // className={styles['progress-slider']}
                    style={{
                        flex: 1,
                        '--track-complete': `${progressPercentage}%`
                    } as CSSProperties}
                />
            </div>
            {/* <div className={styles.buttons}>
                    <button onClick={chronoLens.destroyRecording}>Clear</button>
                </div> */}
            <div style={{ display: 'grid', rowGap: '4px' }}>
                <Checkbox checked={state.showRouteLine} onChange={(checked) => setState((prev) => ({ ...prev, showRouteLine: checked }))}>
                    Show route lines
                </Checkbox>
                <Checkbox checked={state.showRoutePoints} onChange={(checked) => setState((prev) => ({ ...prev, showRoutePoints: checked }))}>
                    Show route points
                </Checkbox>
            </div>
        </div>
    );
};
