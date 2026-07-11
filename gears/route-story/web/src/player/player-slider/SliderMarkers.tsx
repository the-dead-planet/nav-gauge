import { FC, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { draggingImageId$, highlightIdsBySourceId$, imageSourceIds, RouteStoryTranslationKey, RouteTimes } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../../images/image-parser";
import { PlayerOperator } from "@the-dead-planet/nav-gauge-gears-route-story-common/src/player-operator";
import styles from './slider-markers.module.css';

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

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
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
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingImageId, setDraggingImageId] = useSubjectState(draggingImageId$);
    const [
        playLabel,
        pauseLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Player },
        { n: gearId, t: translationKey.Player },
    ]);

    const getPosition = (featureId: number) => {
        const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
        if (!feature || !routeTimes) {
            return 0;
        }
        return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
    };

    useEffect(() => {
        console.log({draggingImageId})
        if (draggingImageId === null) {
            return;
        }
        
        const mouseMoveHandler = () => {
            console.log("moving")
        };

        const mouseUpHandler = () => {
            setDraggingImageId(null);
        };

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        return () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
        };
    }, [draggingImageId]);

    return (
        <div className={styles['slider-markers']}>
            {images
                .filter((image) => image.featureId !== undefined)
                .map((image) => (
                    <span
                        key={image.id}
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => {
                            setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([image.id.toString()])]]));
                        }}
                        onMouseLeave={() => {
                            setHighlightIdsBySourceId(new Map());
                        }}
                        onMouseDown={() => setDraggingImageId(image.id)}
                        className={classNames(styles['image-marker'], { [styles['highlight']]: false })}
                        style={{
                            left: `${getPosition(image.featureId!).toFixed(0)}%`
                        }}
                    />
                ))}
        </div>
    );
};
