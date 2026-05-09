import { CSSProperties, FC, useEffect } from "react";
import { OverlayComponentProps, SurveillanceState, useMachineWard, useStateWarden, useSubjectState } from "@apparatus";
import { formatCurrentTimestamp, getProgressPercentage, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../tinkers";
import { WebChronoLens } from "../chrono-lens/chrono-lens";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './player.module.css';

export const Player: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { individuator } = useMachineWard();
    const { chronoLens, signaliumBureau } = useStateWarden();
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

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            <div className={styles.pictures}>
                {images
                    .filter((image) => image.featureId !== undefined)
                    .map((image) => (
                        <span key={image.id} className={styles['image-marker']} style={{ left: `${getPosition(image.featureId!).toFixed(0)}%` }} />
                    ))}
            </div>
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
                    '--track-complete': `${progressPercentage}%`
                } as CSSProperties}
            />
            <div className={styles.buttons}>
                <p className={styles.text}>
                    {formatCurrentTimestamp(progressMs, progressPercentage)}
                </p>
                <button onClick={playerOperator.onPlay}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={playerOperator.onRecord}>
                    {surveillanceState === SurveillanceState.Stopped ? 'Start' : 'Stop'} recording
                </button>
                {surveillanceState !== SurveillanceState.Stopped ? (
                    <button onClick={playerOperator.onRecordPause}>
                        {surveillanceState === SurveillanceState.Paused ? 'Resume' : 'Pause'} recording
                    </button>
                ) : null}
                <button onClick={chronoLens.destroyRecording}>Clear</button>
                <p className={styles.text}>
                    {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                </p>
            </div>
        </div>
    );
};
