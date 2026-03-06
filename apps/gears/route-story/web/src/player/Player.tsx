import { CSSProperties, FC, useEffect, useMemo } from "react";
import { pairwise } from "rxjs";
import { OverlayComponentProps, SurveillanceState, useMachineWard, useStateWarden, useSubjectState } from "@apparatus";
import { formatCurrentTimestamp, getProgressPercentage, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebChronoLens } from "../chrono-lens/chrono-lens";
import { updateRouteLayer } from "../tinkers";
import * as styles from './player.module.css';

export const Player: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps<maplibregl.Map, File>> = ({
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
    const [isPlaying, setIsPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState, setSurveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [downloadName] = useSubjectState(chronoLens.downloadName$);
    const [fps] = useSubjectState(chronoLens.fps$);

    const WebLens = useMemo(() => new WebChronoLens(individuator), [individuator]);

    useEffect(() => {
        const noticeId = 'player-recording';

        const subscription = chronoLens.surveillanceState$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                switch (next) {
                    case SurveillanceState.Stopped:
                        WebLens.stopRecording();
                        break;
                    case SurveillanceState.Paused:
                        WebLens.pauseRecording(setIsPlaying);
                        break;
                    case SurveillanceState.InProgress: {
                        if (prev === SurveillanceState.Paused) {
                            WebLens.resumeRecording(setIsPlaying);
                        } else {
                            WebLens.startRecording(map.getCanvas(), downloadName, settings, fps, setIsPlaying, setSurveillanceState, (stage, error) => {
                                signaliumBureau.addNotice({
                                    id: noticeId,
                                    type: 'error',
                                    error,
                                    text: `Something went wrong during the ${stage} stage.`
                                });
                            });
                        }
                        break;
                    }
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        playerOperator.updateProgress(
            Number(event.target.value),
            (currentPoint, lines) => {
                updateRouteLayer(map, currentPoint, lines);
            }
        )
    }

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
                <button onClick={() => WebLens.destroyRecording()}>Clear</button>
                <p className={styles.text}>
                    {!routeTimes ? "" : individuator.formatTimestamp(progressMs + routeTimes.startTimeEpoch, settings)}
                </p>
            </div>
        </div>
    );
};
