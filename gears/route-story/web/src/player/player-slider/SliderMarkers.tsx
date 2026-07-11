import { FC, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { FeatureProperties, ParsingResultWithError, useSubjectState } from "@tinker-chest";
import {
    draggingImage$,
    draggingClosestFeature$,
    highlightIdsBySourceId$,
    imageSourceIds,
    RouteStoryTranslationKey,
    RouteTimes,
    updateImageFeatureId
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../../images/image-parser";
import styles from './slider-markers.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
}

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
    data$,
    routeTimes$,
    images$,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [draggingClosestFeature] = useSubjectState(draggingClosestFeature$);
    const [
        imageLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
    ]);

    const getPosition = (featureId: number) => {
        const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
        if (!feature || !routeTimes) {
            return 0;
        }
        return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
    };

    const getClosestFeatureFromPosition = (positionPercent: number): GeoJSON.Feature<GeoJSON.Point, FeatureProperties> | null => {
        if (!geojson || !routeTimes) {
            return null;
        }
        let closestFeature: GeoJSON.Feature<GeoJSON.Point, FeatureProperties> | null = null;
        let closestDistance = Infinity;
        for (const feature of geojson.features) {
            const featureTime = new Date(feature.properties.time).valueOf();
            const featurePercent = (featureTime - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
            const distance = Math.abs(featurePercent - positionPercent);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestFeature = feature;
            }
        }
        return closestFeature;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (draggingImage === null || draggingImage.interaction !== 'player') {
            return;
        }

        const handleMove = (clientX: number) => {
            const container = containerRef.current;
            if (!container) {
                return;
            }
            const rect = container.getBoundingClientRect();
            const positionPercent = ((clientX - rect.left) / rect.width) * 100;
            const closestFeature = getClosestFeatureFromPosition(positionPercent);
            if (closestFeature !== null) {
                draggingClosestFeature$.next(closestFeature);
            }
        };

        const handleEnd = () => {
            const closestFeature = draggingClosestFeature$.value;
            if (draggingImage$.value !== null && closestFeature !== null) {
                updateImageFeatureId(images$, draggingImage$.value.id, closestFeature.properties.id);
            }
            draggingClosestFeature$.next(null);
            setDraggingImage(null);
        };

        const mouseMoveHandler = (e: MouseEvent) => handleMove(e.clientX);
        const mouseUpHandler = () => handleEnd();
        const touchMoveHandler = (e: TouchEvent) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
        };
        const touchEndHandler = () => handleEnd();

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('touchmove', touchMoveHandler, { passive: false });
        window.addEventListener('touchend', touchEndHandler);

        return () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.removeEventListener('touchmove', touchMoveHandler);
            window.removeEventListener('touchend', touchEndHandler);
        };
    }, [draggingImage, images$, getClosestFeatureFromPosition]);

    const draggingFeaturePosition = draggingClosestFeature !== null
        ? getPosition(draggingClosestFeature.properties.id)
        : null;

    return (
        <div ref={containerRef} className={styles['slider-markers']}>
            {images
                .filter((image) => image.featureId !== undefined)
                .map((image) => (
                    <span
                        key={image.id}
                        role="button"
                        tabIndex={0}
                        draggable={false}
                        aria-label={`${imageLabel} ${image.id}`}
                        title={`${imageLabel} ${image.id}`}
                        onMouseEnter={() => {
                            setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([image.id.toString()])]]));
                        }}
                        onMouseLeave={() => {
                            setHighlightIdsBySourceId(new Map());
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setDraggingImage({ id: image.id, interaction: 'player' });
                        }}
                        className={classNames(styles['image-marker'], {
                            [styles['dragging']]: draggingImage?.id === image.id,
                            [styles['highlight']]: draggingImage?.id !== image.id && highlightIdsBySourceId.get(imageSourceIds.thumbnails)?.has(image.id.toString())
                        })}
                        style={{
                            left: `${getPosition(image.featureId!).toFixed(0)}%`
                        }}
                    />
                ))}
            {draggingFeaturePosition !== null && (
                <span
                    className={classNames(styles['image-marker'], styles['drag-marker'], styles['highlight'])}
                    style={{
                        left: `${draggingFeaturePosition.toFixed(0)}%`
                    }}
                />
            )}
        </div>
    );
};
