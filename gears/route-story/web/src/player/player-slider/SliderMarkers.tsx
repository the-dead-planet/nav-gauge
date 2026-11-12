import type * as maplibregl from "maplibre-gl";
import { FC, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import {
    draggingImage$,
    draggingPlacement$,
    highlightIdsBySourceId$,
    imageSourceIds,
    RouteStoryTranslationKey,
    RouteTimes,
    Animatrix,
    updateImageDistanceFraction,
    getDistanceFractionPercent,
    getRouteLngLatAtDistanceFraction,
    getRoutePlacementAtPercent,
    RouteGeometryData,
    getSliderImageMarkers,
    selectedImageId$,
    toggleImageMarkerGroup,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../../images/image-parser";
import { Button, Span, Tooltip } from "@web-ui";
import { useMarkerContainerWidth } from "./useMarkerContainerWidth";
import { Icons } from "@ui";
import styles from "./slider-markers.module.css";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: maplibregl.Map;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
    fitBoundsHandler: (map: maplibregl.Map, boundingBox?: GeoJSON.BBox) => void;
    animatrix: Animatrix;
}

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeGeometryData$,
    routeTimes$,
    images$,
    fitBoundsHandler,
    animatrix,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(
        highlightIdsBySourceId$,
    );
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [draggingPlacement] = useSubjectState(draggingPlacement$);
    const [imageLabel, panToImageLabel, panToWholeRouteAtEndLabel] =
        useMultipleTranslations([
            { n: gearId, t: translationKey.Image },
            { n: gearId, t: translationKey.PanToImage },
            {
                n: animatrix.namespace,
                t: animatrix.translationKey.PanToWholeRouteAtEnd,
            },
        ]);

    const containerRef = useRef<HTMLDivElement>(null);
    const containerWidth = useMarkerContainerWidth(containerRef);
    const [selectedImageId] = useSubjectState(selectedImageId$);
    const dragStartX = useRef(0);
    const didDrag = useRef(false);
    const markerGroups =
        geojson && routeGeometryData && routeTimes
            ? getSliderImageMarkers(
                  images,
                  (fraction) =>
                      getDistanceFractionPercent(
                          fraction,
                          geojson,
                          routeGeometryData,
                          routeTimes.startTimeEpoch,
                          routeTimes.duration,
                          animationControls.playbackPacing,
                      ),
                  containerWidth,
                  routeGeometryData.totalDistanceMeters,
                  selectedImageId,
              )
            : [];

    useEffect(() => {
        if (draggingImage === null || draggingImage.interaction !== "player") {
            return;
        }

        const handleMove = (clientX: number) => {
            if (
                !didDrag.current &&
                Math.abs(clientX - dragStartX.current) < 4
            ) {
                return;
            }
            didDrag.current = true;
            const container = containerRef.current;
            if (!container) {
                return;
            }
            const rect = container.getBoundingClientRect();
            const positionPercent = ((clientX - rect.left) / rect.width) * 100;
            const placement = getRoutePlacementAtPercent(
                positionPercent,
                geojson,
                routeTimes,
                routeGeometryData,
                animationControls.playbackPacing,
            );
            if (placement !== null) {
                draggingPlacement$.next(placement);
            }
        };

        const handleEnd = (cancelled = false) => {
            const placement = draggingPlacement$.value;
            if (
                !cancelled &&
                didDrag.current &&
                draggingImage$.value !== null &&
                placement !== null
            ) {
                updateImageDistanceFraction(
                    images$,
                    draggingImage$.value.id,
                    placement.distanceFraction,
                );
            }
            draggingPlacement$.next(null);
            setDraggingImage(null);
        };

        const pointerMoveHandler = (e: PointerEvent) => handleMove(e.clientX);
        const pointerUpHandler = () => handleEnd();
        const pointerCancelHandler = () => handleEnd(true);

        window.addEventListener("pointermove", pointerMoveHandler);
        window.addEventListener("pointerup", pointerUpHandler);
        window.addEventListener("pointercancel", pointerCancelHandler);

        return () => {
            window.removeEventListener("pointermove", pointerMoveHandler);
            window.removeEventListener("pointerup", pointerUpHandler);
            window.removeEventListener("pointercancel", pointerCancelHandler);
        };
    }, [
        draggingImage,
        images$,
        geojson,
        routeTimes,
        animationControls.playbackPacing,
        routeGeometryData,
        setDraggingImage,
    ]);

    const draggingPosition =
        draggingPlacement !== null && geojson && routeGeometryData && routeTimes
            ? getDistanceFractionPercent(
                  draggingPlacement.distanceFraction,
                  geojson,
                  routeGeometryData,
                  routeTimes.startTimeEpoch,
                  routeTimes.duration,
                  animationControls.playbackPacing,
              )
            : null;

    return (
        <div ref={containerRef} className={styles["slider-markers"]}>
            {animationControls.panToWholeRouteAtEnd && (
                <div className={styles["route-end-marker-container"]}>
                    <span
                        role="presentation"
                        className={classNames(
                            styles["image-marker"],
                            styles["route-end-marker"],
                        )}
                    />
                    <Tooltip
                        content={panToWholeRouteAtEndLabel}
                        placement="top"
                        size="xs"
                    >
                        <Button
                            icon={Icons.NounProject.Target}
                            size="xs"
                            aria-label={panToWholeRouteAtEndLabel}
                            onClick={(event) => {
                                event.stopPropagation();
                                fitBoundsHandler(map, data$.value.boundingBox);
                            }}
                            className={styles["pan-to-icon"]}
                        />
                    </Tooltip>
                </div>
            )}
            {markerGroups.map(({ image, imageIds, percent }) => {
                const highlighted =
                    selectedImageId === image.id ||
                    (draggingImage?.id !== image.id &&
                        imageIds.some((imageId) =>
                            highlightIdsBySourceId
                                .get(imageSourceIds.thumbnails)
                                ?.has(String(imageId)),
                        ));
                return (
                    <div
                        key={image.id}
                        className={classNames(
                            styles["image-marker-container"],
                            {
                                [styles["unselected"]]:
                                    selectedImageId !== null &&
                                    !imageIds.includes(selectedImageId),
                            },
                        )}
                        style={{
                            left: `${percent}%`,
                        }}
                    >
                        <Tooltip
                            color="tertiary"
                            content={panToImageLabel}
                            placement="top"
                            size="xs"
                        >
                            <Button
                                icon={Icons.NounProject.Target}
                                size="xs"
                                color="tertiary"
                                aria-label={panToImageLabel}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    const lngLat =
                                        geojson && routeGeometryData
                                            ? getRouteLngLatAtDistanceFraction(
                                                  geojson,
                                                  routeGeometryData,
                                                  image.distanceFraction!,
                                              )
                                            : undefined;
                                    if (lngLat) {
                                        fitBoundsHandler(map, [
                                            lngLat.lng,
                                            lngLat.lat,
                                            lngLat.lng,
                                            lngLat.lat,
                                        ]);
                                    }
                                }}
                                className={styles["pan-to-icon"]}
                            />
                        </Tooltip>
                        <Tooltip
                            color="tertiary"
                            content={`${imageLabel} ${image.id}`}
                            placement="top"
                            size="xs"
                        >
                            <span
                                role="button"
                                tabIndex={0}
                                draggable={false}
                                aria-label={
                                    imageIds.length > 1
                                        ? `${imageIds.length} × ${imageLabel}: ${imageIds.join(", ")}`
                                        : `${imageLabel} ${image.id}`
                                }
                                aria-pressed={imageIds.includes(
                                    selectedImageId ?? -1,
                                )}
                                onClick={() => {
                                    if (!didDrag.current) {
                                        toggleImageMarkerGroup(imageIds);
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        toggleImageMarkerGroup(imageIds);
                                    }
                                }}
                                onMouseEnter={() => {
                                    setHighlightIdsBySourceId(
                                        new Map([
                                            [
                                                imageSourceIds.thumbnails,
                                                new Set(imageIds.map(String)),
                                            ],
                                        ]),
                                    );
                                }}
                                onMouseLeave={() => {
                                    setHighlightIdsBySourceId(new Map());
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.setPointerCapture(
                                        e.pointerId,
                                    );
                                    dragStartX.current = e.clientX;
                                    didDrag.current = false;
                                    setDraggingImage({
                                        id: image.id,
                                        interaction: "player",
                                    });
                                }}
                                className={classNames(styles["image-marker"], {
                                    [styles["dragging"]]:
                                        draggingImage?.id === image.id,
                                    [styles["highlight"]]: highlighted,
                                })}
                            >
                                {imageIds.length > 1 && (
                                    <Span
                                        aria-hidden="true"
                                        fontWeight={highlighted ? 600 : 300}
                                        className={styles["marker-count"]}
                                    >
                                        {imageIds.length}
                                    </Span>
                                )}
                            </span>
                        </Tooltip>
                    </div>
                );
            })}
            {draggingPosition !== null && (
                <span
                    className={classNames(
                        styles["image-marker"],
                        styles["drag-marker"],
                        styles["highlight"],
                    )}
                    style={{
                        left: `${draggingPosition.toFixed(4)}%`,
                    }}
                />
            )}
        </div>
    );
};
