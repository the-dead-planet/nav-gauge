import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes, Animatrix, RouteGeometryData, getRouteDistanceFraction, getRouteTimelinePositionForDistanceFraction } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../../tinkers";
import { Slider } from "@web-ui";
import { WebMarkerImageData } from "../../images/image-parser";
import { SliderMarkers } from "./SliderMarkers";
import { PlayerSliderLabels } from "./PlayerSliderLabels";
import { WebPlayerOperator } from "../../model";
import styles from './player-slider.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: maplibregl.Map;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    playerOperator: WebPlayerOperator;
    fitBoundsHandler: (map: maplibregl.Map, boundingBox?: GeoJSON.BBox) => void;
    animatrix: Animatrix;
    className?: string;
}

export const SliderWithMarkers: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeGeometryData$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
    fitBoundsHandler,
    animatrix,
    className,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);
    const [
        sliderLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Slider },
    ]);

    const handleProgressChange = (value: number) => {
        const nextProgressMs = animationControls.playbackPacing === 'distance' && geojson && routeGeometryData && routeTimes
            ? getRouteTimelinePositionForDistanceFraction(geojson, routeGeometryData, routeTimes.startTimeEpoch, value / Math.max(routeGeometryData.totalDistanceMeters, 1))
            : value;
        playerOperator.updateProgress(
            nextProgressMs,
            (line, currentPoint, state) => {
                updateRouteLayer(map, line, currentPoint, state);
            }
        )
    };

    return (
        <div className={classNames(styles['container'], className)}>
            <div className={styles['slider-container']}>
                {showImageMarkers ? (
                    <SliderMarkers
                        gearId={gearId}
                        translationKey={translationKey}
                        map={map}
                        data$={data$}
                        routeGeometryData$={routeGeometryData$}
                        routeTimes$={routeTimes$}
                        images$={images$}
                        fitBoundsHandler={fitBoundsHandler}
                        animatrix={animatrix}
                    />
                ) : null}
                <Slider
                    aria-label={sliderLabel}
                    value={animationControls.playbackPacing === 'distance'
                        ? getRouteDistanceFraction(progressMs, geojson, routeTimes, routeGeometryData) * (routeGeometryData?.totalDistanceMeters ?? 1)
                        : progressMs}
                    min={0}
                    max={animationControls.playbackPacing === 'distance' ? Math.max(routeGeometryData?.totalDistanceMeters ?? 0, 1) : routeTimes?.duration ?? 1}
                    step={1}
                    onChange={handleProgressChange}
                    color="tertiary"
                    size="sm"
                />
            </div>
            <PlayerSliderLabels data$={data$} routeGeometryData$={routeGeometryData$} progressMs$={progressMs$} routeTimes$={routeTimes$} animatrix={animatrix} />
        </div>
    );
};
