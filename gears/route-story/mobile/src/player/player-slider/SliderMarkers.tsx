import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { PanResponder, StyleSheet, View, type GestureResponderEvent, type HostInstance } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import {
    draggingImage$,
    draggingClosestFeature$,
    highlightIdsBySourceId$,
    imageSourceIds,
    RouteStoryTranslationKey,
    RouteTimes,
    Animatrix,
    updateImageFeatureId,
    getPosition,
    getClosestFeatureFromPosition,
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
const MARKER_HEIGHT = 42;

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
        top: 0,
        width: 16,
        height: MARKER_HEIGHT,
        marginLeft: -8,
        alignItems: 'center',
    },
    markerHead: {
        width: 8,
        height: 8,
        marginBottom: -2,
        transform: [{ rotate: '45deg' }],
    },
    markerLine: {
        width: 2,
        flex: 1,
    },
    markerFoot: {
        width: 5,
        height: 2,
        marginTop: -1,
    },
    panToButton: {
        position: 'absolute',
        bottom: -14,
        width: 12,
        height: 12,
        minWidth: 12,
        opacity: 0.4,
    },
    dragMarker: {
        opacity: 0.5,
    },
    routeEndMarker: {
        position: 'absolute',
        right: 0,
        top: 0,
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
    const [draggingClosestFeature] = useSubjectState(draggingClosestFeature$);
    const [
        imageLabel,
        panToImageLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
        { n: gearId, t: translationKey.PanToImage },
    ]);

    const containerRef = useRef<HostInstance>(null);
    const containerMetricsRef = useRef({ pageX: 0, pageY: 0, width: 0 });
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
        const closestFeature = getClosestFeatureFromPosition(positionPercent, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData);
        if (closestFeature !== null) {
            draggingClosestFeature$.next(closestFeature);
        }
    };

    const endDrag = () => {
        const activeDragImage = draggingImage$.value;
        const closestFeature = draggingClosestFeature$.value;
        if (activeDragImage !== null && closestFeature !== null) {
            updateImageFeatureId(images$, activeDragImage.id, closestFeature.properties.id);
        }
        draggingClosestFeature$.next(null);
        setHighlightIdsBySourceId(new Map());
        setDraggingImage(null);
    };

    const tryBeginDragAt = useCallback((event: GestureResponderEvent): boolean => {
        const metrics = containerMetricsRef.current;
        if (!geojson || !routeTimes || metrics.width <= 0 || event.nativeEvent.pageY - metrics.pageY > MARKER_HEIGHT) {
            return false;
        }
        const offsetX = event.nativeEvent.pageX - metrics.pageX;
        const grabbed = images.find((candidate) =>
            candidate.featureId !== undefined &&
            Math.abs((getPosition(candidate.featureId, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData) / 100) * metrics.width - offsetX) <= GRAB_RADIUS_PX
        );
        if (grabbed === undefined) {
            return false;
        }
        beginDrag(grabbed);
        updateDraggingFeature(event.nativeEvent.pageX);

        return true;
    }, [images, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData]);

    const containerPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponderCapture: (event) => tryBeginDragAt(event),
        onMoveShouldSetPanResponderCapture: () => isDraggingPlayerRef.current,
        onPanResponderMove: (_event, gestureState) => updateDraggingFeature(gestureState.moveX),
        onPanResponderRelease: endDrag,
        onPanResponderTerminate: endDrag,
    }), [tryBeginDragAt, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData]);

    const draggingFeaturePosition = draggingClosestFeature !== null
        ? getPosition(draggingClosestFeature.properties.id, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData)
        : null;

    return (
        <View ref={containerRef} style={styles.container} {...containerPanResponder.panHandlers}>
            {images
                .filter((image) => image.featureId !== undefined)
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
                                isDragged ? styles.dragMarker : undefined,
                                {
                                    left: `${getPosition(image.featureId, geojson, routeTimes, animationControls.playbackPacing, routeGeometryData).toFixed(0)}%`,
                                },
                            ]}
                        >
                            <Tooltip color="tertiary" content={panToImageLabel} placement="bottom" size="xs">
                                <Button
                                    icon={Icons.NounProject.Target}
                                    size="xs"
                                    color="tertiary"
                                    accessibilityLabel={panToImageLabel}
                                    onPress={() => {
                                        const feature = geojson?.features.find((candidate) => candidate.properties.id === image.featureId);
                                        if (feature) {
                                            map.camera$.value?.easeTo({
                                                center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                                                duration: 300,
                                            });
                                        }
                                    }}
                                    style={styles.panToButton}
                                />
                            </Tooltip>
                            <View style={[styles.markerHead, { backgroundColor: color }]} />
                            <View style={[styles.markerLine, { backgroundColor: color }]} />
                            <View style={[styles.markerFoot, { backgroundColor: color }]} />
                        </View>
                    );
                })}
            {animationControls.panToWholeRouteAtEnd && (
                <View pointerEvents="none" style={styles.routeEndMarker}>
                    <View style={[styles.markerHead, { backgroundColor: routeEndMarkerColor }]} />
                    <View style={[styles.markerLine, { backgroundColor: routeEndMarkerColor }]} />
                    <View style={[styles.markerFoot, { backgroundColor: routeEndMarkerColor }]} />
                </View>
            )}
            {draggingFeaturePosition !== null ? (
                <View
                    style={[styles.marker, styles.dragMarker, {
                        left: `${draggingFeaturePosition.toFixed(0)}%`,
                    }]}
                >
                    <View style={[styles.markerHead, { backgroundColor: markerHighlightColor }]} />
                    <View style={[styles.markerLine, { backgroundColor: markerHighlightColor }]} />
                    <View style={[styles.markerFoot, { backgroundColor: markerHighlightColor }]} />
                </View>
            ) : null}
        </View>
    );
};
