import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder, StyleSheet, View, type GestureResponderEvent, type HostInstance } from "react-native";
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
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, useTheme } from "@ui";
import { Button, Tooltip } from "@mobile-ui";
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
        position: 'absolute',
        left: 8,
        right: 8,
        top: 0,
        bottom: 0,
    },
    marker: {
        position: 'absolute',
        top: MARKER_ACTION_HEIGHT,
        width: 16,
        height: MARKER_HEIGHT,
        marginLeft: -8,
        alignItems: 'center',
    },
    markerHead: {
        width: 8,
        height: 8,
        marginTop: -2,
        transform: [{ rotate: '45deg' }],
    },
    markerLine: {
        width: 2,
        flex: 1,
    },
    panToButton: {
        position: 'absolute',
        top: -MARKER_ACTION_HEIGHT + 2,
        width: 12,
        height: 12,
        minWidth: 12,
    },
    dragMarker: {
        opacity: 0.5,
    },
    routeEndMarker: {
        position: 'absolute',
        right: 0,
        top: MARKER_ACTION_HEIGHT,
        width: 16,
        height: MARKER_HEIGHT,
        marginRight: -8,
        alignItems: 'center',
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
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [
        imageLabel,
        panToImageLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
        { n: gearId, t: translationKey.PanToImage },
    ]);

    const containerRef = useRef<HostInstance>(null);
    const containerMetricsRef = useRef({ pageX: 0, pageY: 0, width: 0 });
    const draggingPositionRef = useRef(new Animated.Value(0));
    const isDraggingPlayerRef = useRef(false);
    isDraggingPlayerRef.current = draggingImage?.interaction === 'player';

    useEffect(() => {
        containerRef.current?.measureInWindow((x, y, width) => {
            containerMetricsRef.current = { pageX: x, pageY: y, width };
        });
    });

    const markerColor = theme.color('tertiary', 500);
    const markerHighlightColor = theme.color('tertiary', theme.isDark ? 400 : 800);
    const routeEndMarkerColor = theme.color('neutral', 500);

    const beginDrag = (image: MarkerImage<MobileMarkerImageData>) => {
        setDraggingImage({ id: image.id, interaction: 'player' });
        setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([String(image.id)])]]));
        containerRef.current?.measureInWindow((x, y, width) => {
            containerMetricsRef.current = { pageX: x, pageY: y, width };
        });
    };

    const updateDraggingFeature = (pageX: number) => {
        const metrics = containerMetricsRef.current;
        if (metrics.width <= 0) {
            return;
        }
        const positionPercent = ((pageX - metrics.pageX) / metrics.width) * 100;
        draggingPositionRef.current.setValue(positionPercent);
        const placement = getRoutePlacementAtPercent(positionPercent, geojson, routeTimes, routeGeometryData, animationControls.playbackPacing);
        if (placement !== null) {
            draggingPlacement$.next(placement);
        }
    };

    const endDrag = () => {
        const activeDragImage = draggingImage$.value;
        const placement = draggingPlacement$.value;
        if (activeDragImage !== null && placement !== null) {
            updateImageDistanceFraction(images$, activeDragImage.id, placement.distanceFraction);
        }
        draggingPlacement$.next(null);
        setHighlightIdsBySourceId(new Map());
        setDraggingImage(null);
    };

    const tryBeginDragAt = useCallback((event: GestureResponderEvent): boolean => {
        const metrics = containerMetricsRef.current;
        const offsetY = event.nativeEvent.pageY - metrics.pageY;
        if (!geojson || !routeTimes || !routeGeometryData || metrics.width <= 0 || offsetY < MARKER_ACTION_HEIGHT || offsetY > MARKER_ACTION_HEIGHT + MARKER_HEIGHT) {
            return false;
        }
        const offsetX = event.nativeEvent.pageX - metrics.pageX;
        const grabbed = images$.value.find((candidate) =>
            candidate.distanceFraction !== undefined &&
            Math.abs((getDistanceFractionPercent(
                candidate.distanceFraction,
                geojson,
                routeGeometryData,
                routeTimes.startTimeEpoch,
                routeTimes.duration,
                animationControls.playbackPacing,
            ) / 100) * metrics.width - offsetX) <= GRAB_RADIUS_PX
        );
        if (grabbed === undefined) {
            return false;
        }
        beginDrag(grabbed);
        updateDraggingFeature(event.nativeEvent.pageX);

        return true;
    }, [images$, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData]);

    const containerPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponderCapture: (event) => tryBeginDragAt(event),
        onMoveShouldSetPanResponderCapture: () => isDraggingPlayerRef.current,
        onPanResponderMove: (_event, gestureState) => updateDraggingFeature(gestureState.moveX),
        onPanResponderRelease: endDrag,
        onPanResponderTerminate: endDrag,
    }), [tryBeginDragAt, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData]);

    return (
        <View ref={containerRef} style={styles.container} {...containerPanResponder.panHandlers}>
            {images
                .filter((image) => image.distanceFraction !== undefined && geojson && routeGeometryData && routeTimes)
                .map((image) => {
                    const isDragged = draggingImage?.id === image.id && draggingImage.interaction === 'player';
                    const highlighted = highlightIdsBySourceId.get(imageSourceIds.thumbnails)?.has(String(image.id)) ?? false;
                    const color = highlighted || isDragged ? markerHighlightColor : markerColor;

                    return (
                        <View
                            key={image.id}
                            accessible
                            accessibilityLabel={`${imageLabel} ${image.id}`}
                            style={[
                                styles.marker,
                                {
                                    left: `${getDistanceFractionPercent(
                                        image.distanceFraction!,
                                        geojson!,
                                        routeGeometryData!,
                                        routeTimes!.startTimeEpoch,
                                        routeTimes!.duration,
                                        animationControls.playbackPacing,
                                    ).toFixed(0)}%`,
                                },
                            ]}
                        >
                            <Tooltip color="tertiary" content={panToImageLabel} placement="top" size="xs">
                                <Button
                                    icon={Icons.NounProject.Target}
                                    size="xs"
                                    color="tertiary"
                                    accessibilityLabel={panToImageLabel}
                                    onPress={() => {
                                        const lngLat = geojson && routeGeometryData
                                            ? getRouteLngLatAtDistanceFraction(geojson, routeGeometryData, image.distanceFraction!)
                                            : undefined;
                                        if (lngLat) {
                                            map.camera$.value?.easeTo({
                                                center: [lngLat.lng, lngLat.lat],
                                                duration: 300,
                                            });
                                        }
                                    }}
                                    style={styles.panToButton}
                                />
                            </Tooltip>
                            <View style={[styles.markerLine, isDragged && styles.dragMarker, { backgroundColor: color }]} />
                            <View style={[styles.markerHead, isDragged && styles.dragMarker, { backgroundColor: color }]} />
                        </View>
                    );
                })}
            {animationControls.panToWholeRouteAtEnd && (
                <View pointerEvents="none" style={styles.routeEndMarker}>
                    <View style={[styles.markerLine, { backgroundColor: routeEndMarkerColor }]} />
                    <View style={[styles.markerHead, { backgroundColor: routeEndMarkerColor }]} />
                </View>
            )}
            {draggingImage?.interaction === 'player' ? (
                <Animated.View
                    style={[styles.marker, styles.dragMarker, {
                        left: draggingPositionRef.current.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                    }]}
                >
                    <View style={[styles.markerLine, { backgroundColor: markerHighlightColor }]} />
                    <View style={[styles.markerHead, { backgroundColor: markerHighlightColor }]} />
                </Animated.View>
            ) : null}
        </View>
    );
};
