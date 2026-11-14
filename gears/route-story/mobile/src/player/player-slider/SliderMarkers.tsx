import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    StyleSheet,
    View,
    type GestureResponderEvent,
    type HostInstance,
} from "react-native";
import { BehaviorSubject } from "rxjs";
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
    clearImageMarkerSelection,
    formatImageMarkerCount,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, useTheme } from "@ui";
import { Button, Text, Tooltip } from "@mobile-ui";
import { MobileMap } from "@mobile-apparatus";
import { MobileMarkerImageData } from "../../images/image-parser";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: MobileMap;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeGeometryData$: BehaviorSubject<RouteGeometryData | null>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
    animatrix: Animatrix;
}

const GRAB_RADIUS_PX = 20;
const MARKER_HEIGHT = 44;
const MARKER_ACTION_HEIGHT = 14;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 8,
        right: 8,
        top: 0,
        bottom: 0,
    },
    marker: {
        position: "absolute",
        top: MARKER_ACTION_HEIGHT,
        width: 16,
        height: MARKER_HEIGHT,
        marginLeft: -8,
        alignItems: "center",
    },
    markerHead: {
        width: 8,
        height: 8,
        marginTop: -2,
        transform: [{ rotate: "45deg" }],
    },
    markerLine: {
        width: 2,
        flex: 1,
    },
    panToButton: {
        position: "absolute",
        top: -MARKER_ACTION_HEIGHT + 2,
        width: 12,
        height: 12,
        minWidth: 12,
    },
    dragMarker: {
        opacity: 0.5,
    },
    hiddenPanToButton: {
        display: 'none',
    },
    markerCount: {
        position: "absolute",
        left: 14,
        bottom: -7,
        fontSize: 8,
        lineHeight: 10,
    },
    unselected: {
        opacity: 0.45,
    },
    routeEndMarker: {
        position: "absolute",
        right: 0,
        top: MARKER_ACTION_HEIGHT,
        width: 16,
        height: MARKER_HEIGHT,
        marginRight: -8,
        alignItems: "center",
    },
});

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeGeometryData$,
    routeTimes$,
    images$,
    animatrix,
}) => {
    const theme = useTheme();
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(
        highlightIdsBySourceId$,
    );
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [selectedImageId] = useSubjectState(selectedImageId$);
    const [containerWidth, setContainerWidth] = useState(0);
    const [imageLabel, panToImageLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
        { n: gearId, t: translationKey.PanToImage },
    ]);

    const containerRef = useRef<HostInstance>(null);
    const containerMetricsRef = useRef({ pageX: 0, pageY: 0, width: 0 });
    const draggingPositionRef = useRef(new Animated.Value(0));
    const isDraggingPlayerRef = useRef(false);
    const dragGestureRef = useRef<{
        startX: number;
        imageIds: number[];
        moved: boolean;
    } | null>(null);
    isDraggingPlayerRef.current = draggingImage?.interaction === "player";

    useEffect(() => {
        containerRef.current?.measureInWindow((x, y, width) => {
            containerMetricsRef.current = { pageX: x, pageY: y, width };
        });
    });

    const markerColor = theme.color("tertiary", 500);
    const markerHighlightColor = theme.color(
        "tertiary",
        theme.isDark ? 400 : 800,
    );
    const routeEndMarkerColor = theme.color("neutral", 500);
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

    const beginDrag = (image: MarkerImage<MobileMarkerImageData>) => {
        setDraggingImage({ id: image.id, interaction: "player" });
        setHighlightIdsBySourceId(
            new Map([[imageSourceIds.thumbnails, new Set([String(image.id)])]]),
        );
        containerRef.current?.measureInWindow((x, y, width) => {
            containerMetricsRef.current = { pageX: x, pageY: y, width };
        });
    };

    const updateDraggingFeature = (pageX: number) => {
        const gesture = dragGestureRef.current;
        if (
            !gesture ||
            (!gesture.moved && Math.abs(pageX - gesture.startX) < 4)
        ) {
            return;
        }
        gesture.moved = true;
        const metrics = containerMetricsRef.current;
        if (metrics.width <= 0) {
            return;
        }
        const positionPercent = ((pageX - metrics.pageX) / metrics.width) * 100;
        draggingPositionRef.current.setValue(positionPercent);
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

    const endDrag = (cancelled = false) => {
        const gesture = dragGestureRef.current;
        const activeDragImage = draggingImage$.value;
        const placement = draggingPlacement$.value;
        if (
            !cancelled &&
            gesture?.moved &&
            activeDragImage !== null &&
            placement !== null
        ) {
            updateImageDistanceFraction(
                images$,
                activeDragImage.id,
                placement.distanceFraction,
            );
        }
        draggingPlacement$.next(null);
        if (gesture?.moved) {
            clearImageMarkerSelection();
        }
        setHighlightIdsBySourceId(new Map());
        setDraggingImage(null);
        if (!cancelled && gesture && !gesture.moved) {
            toggleImageMarkerGroup(gesture.imageIds);
        }
        dragGestureRef.current = null;
    };

    const tryBeginDragAt = useCallback(
        (event: GestureResponderEvent): boolean => {
            const metrics = containerMetricsRef.current;
            const offsetY = event.nativeEvent.pageY - metrics.pageY;
            if (
                !geojson ||
                !routeTimes ||
                !routeGeometryData ||
                metrics.width <= 0 ||
                offsetY < MARKER_ACTION_HEIGHT ||
                offsetY > MARKER_ACTION_HEIGHT + MARKER_HEIGHT
            ) {
                return false;
            }
            const offsetX = event.nativeEvent.pageX - metrics.pageX;
            const groups = getSliderImageMarkers(
                images$.value,
                (fraction) =>
                    getDistanceFractionPercent(
                        fraction,
                        geojson,
                        routeGeometryData,
                        routeTimes.startTimeEpoch,
                        routeTimes.duration,
                        animationControls.playbackPacing,
                    ),
                metrics.width,
                routeGeometryData.totalDistanceMeters,
                selectedImageId$.value,
            );
            const grabbed = groups.reduce<(typeof groups)[number] | undefined>(
                (nearest, group) => {
                    const distance = Math.abs(
                        (group.percent / 100) * metrics.width - offsetX,
                    );
                    return distance <= GRAB_RADIUS_PX &&
                        (!nearest ||
                            distance <
                                Math.abs(
                                    (nearest.percent / 100) * metrics.width -
                                        offsetX,
                                ))
                        ? group
                        : nearest;
                },
                undefined,
            );
            if (grabbed === undefined) {
                return false;
            }
            dragGestureRef.current = {
                startX: event.nativeEvent.pageX,
                imageIds: grabbed.imageIds,
                moved: false,
            };
            draggingPositionRef.current.setValue(grabbed.percent);
            beginDrag(grabbed.image);

            return true;
        },
        [
            images$,
            geojson,
            routeTimes,
            animationControls.playbackPacing,
            routeGeometryData,
        ],
    );

    const containerPanResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponderCapture: (event) =>
                    tryBeginDragAt(event),
                onMoveShouldSetPanResponderCapture: () =>
                    isDraggingPlayerRef.current,
                onPanResponderMove: (_event, gestureState) =>
                    updateDraggingFeature(gestureState.moveX),
                onPanResponderRelease: () => endDrag(),
                onPanResponderTerminate: () => endDrag(true),
            }),
        [
            tryBeginDragAt,
            geojson,
            routeTimes,
            animationControls.playbackPacing,
            routeGeometryData,
        ],
    );

    return (
        <View
            ref={containerRef}
            style={styles.container}
            onLayout={(event) =>
                setContainerWidth(event.nativeEvent.layout.width)
            }
            {...containerPanResponder.panHandlers}
        >
            {markerGroups.map(({ image, imageIds, percent }) => {
                const isDragged =
                    draggingImage?.id === image.id &&
                    draggingImage.interaction === "player";
                const highlighted = imageIds.some((imageId) =>
                    highlightIdsBySourceId
                        .get(imageSourceIds.thumbnails)
                        ?.has(String(imageId)),
                );
                const selected = imageIds.includes(selectedImageId ?? -1);
                const isHighlighted = highlighted || isDragged || selected;
                const color = isHighlighted
                    ? markerHighlightColor
                    : markerColor;

                return (
                    <View
                        key={image.id}
                        accessible
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={
                            imageIds.length > 1
                                ? `${imageIds.length} × ${imageLabel}: ${imageIds.join(", ")}`
                                : `${imageLabel} ${image.id}`
                        }
                        onAccessibilityTap={() =>
                            toggleImageMarkerGroup(imageIds)
                        }
                        style={[
                            styles.marker,
                            selectedImageId !== null &&
                                !selected &&
                                styles.unselected,
                            {
                                left: `${percent}%`,
                            },
                        ]}
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
                                accessibilityLabel={panToImageLabel}
                                onPress={() => {
                                    const lngLat =
                                        geojson && routeGeometryData
                                            ? getRouteLngLatAtDistanceFraction(
                                                  geojson,
                                                  routeGeometryData,
                                                  image.distanceFraction!,
                                              )
                                            : undefined;
                                    if (lngLat) {
                                        map.camera$.value?.easeTo({
                                            center: [lngLat.lng, lngLat.lat],
                                            duration: 300,
                                        });
                                    }
                                }}
                                style={[styles.panToButton, isDragged && styles.hiddenPanToButton]}
                            />
                        </Tooltip>
                        <View
                            style={[
                                styles.markerLine,
                                isDragged && styles.dragMarker,
                                { backgroundColor: color },
                            ]}
                        />
                        <View
                            style={[
                                styles.markerHead,
                                isDragged && styles.dragMarker,
                                { backgroundColor: color },
                            ]}
                        />
                        {imageIds.length > 1 && (
                            <Text
                                accessible={false}
                                fontWeight={isHighlighted ? 600 : 300}
                                style={styles.markerCount}
                            >
                                {formatImageMarkerCount(imageIds.length)}
                            </Text>
                        )}
                    </View>
                );
            })}
            {animationControls.panToWholeRouteAtEnd && (
                <View pointerEvents="none" style={styles.routeEndMarker}>
                    <View
                        style={[
                            styles.markerLine,
                            { backgroundColor: routeEndMarkerColor },
                        ]}
                    />
                    <View
                        style={[
                            styles.markerHead,
                            { backgroundColor: routeEndMarkerColor },
                        ]}
                    />
                </View>
            )}
            {draggingImage?.interaction === "player" ? (
                <Animated.View
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    style={[
                        styles.marker,
                        styles.dragMarker,
                        {
                            left: draggingPositionRef.current.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                            }),
                        },
                    ]}
                >
                    <Button
                        icon={Icons.NounProject.Target}
                        size="xs"
                        color="tertiary"
                        accessibilityLabel={panToImageLabel}
                        style={styles.panToButton}
                    />
                    <View
                        style={[
                            styles.markerLine,
                            { backgroundColor: markerHighlightColor },
                        ]}
                    />
                    <View
                        style={[
                            styles.markerHead,
                            { backgroundColor: markerHighlightColor },
                        ]}
                    />
                </Animated.View>
            ) : null}
        </View>
    );
};
