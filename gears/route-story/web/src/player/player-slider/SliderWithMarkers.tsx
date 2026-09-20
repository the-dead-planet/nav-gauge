import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey, RouteTimes, Animatrix, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
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
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
    routeTimelinePositionMs$: BehaviorSubject<number>;
    playerOperator: WebPlayerOperator;
    fitBoundsHandler: (map: maplibregl.Map, boundingBox?: GeoJSON.BBox) => void;
    animatrix: Animatrix;
    state$: BehaviorSubject<RouteStoryState>;
    className?: string;
}

export const SliderWithMarkers: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeTimes$,
    images$,
    routeTimelinePositionMs$,
    playerOperator,
    fitBoundsHandler,
    animatrix,
    state$,
    className,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const [showImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);
    const [
        sliderLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Slider },
    ]);

    const handleRouteTimelinePositionChange = (value: number) => {
        playerOperator.updateRouteTimelinePosition(
            value,
            (line, _currentPoint, routeDistanceFraction) => {
                updateRouteLayer({ map, line, routeDistanceFraction, state: state$.value });
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
                        routeTimes$={routeTimes$}
                        images$={images$}
                        fitBoundsHandler={fitBoundsHandler}
                        animatrix={animatrix}
                    />
                ) : null}
                <Slider
                    aria-label={sliderLabel}
                    value={routeTimelinePositionMs}
                    min={0}
                    max={routeTimes?.duration ?? 1}
                    step={1}
                    onChange={handleRouteTimelinePositionChange}
                    color="tertiary"
                    size="sm"
                />
            </div>
            <PlayerSliderLabels routeTimelinePositionMs$={routeTimelinePositionMs$} routeTimes$={routeTimes$} />
        </div>
    );
};
