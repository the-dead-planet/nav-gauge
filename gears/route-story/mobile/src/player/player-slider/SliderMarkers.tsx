import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { PanResponder, StyleSheet, View, type GestureResponderEvent, type HostInstance } from "react-native";
import { BehaviorSubject } from "rxjs";
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
import { useTheme } from "@ui";
import { MobileMarkerImageData } from "../../images/image-parser";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>;
}

const GRAB_RADIUS_PX = 20;

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
        height: 44,
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
    dragMarker: {
        opacity: 0.5,
    },
});

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
    data$,
    routeTimes$,
    images$,
}) => {
    const theme = useTheme();
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [draggingClosestFeature] = useSubjectState(draggingClosestFeature$);
    const [imageLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
    ]);

    const containerRef = useRef<HostInstance>(null);
    const containerMetricsRef = useRef({ pageX: 0, width: 0 });
    const isDraggingPlayerRef = useRef(false);
    isDraggingPlayerRef.current = draggingImage?.interaction === 'player';

    useEffect(() => {
        containerRef.current?.measureInWindow((x, _y, width) => {
            containerMetricsRef.current = { pageX: x, width };
        });
    });

    const markerColor = theme.color('tertiary', 500);
    const markerHighlightColor = theme.color('tertiary', theme.isDark ? 400 : 800);

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

    const beginDrag = (image: MarkerImage<MobileMarkerImageData>) => {
        setDraggingImage({ id: image.id, interaction: 'player' });
        setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([String(image.id)])]]));
        containerRef.current?.measureInWindow((x, _y, width) => {
            containerMetricsRef.current = { pageX: x, width };
        });
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

    const tryBeginDragAt = useCallback((evt: GestureResponderEvent): boolean => {
        const metrics = containerMetricsRef.current;
        if (!geojson || !routeTimes || metrics.width <= 0) {
            return false;
        }
        const offsetX = evt.nativeEvent.pageX - metrics.pageX;
        const grabbed = images.find((candidate) =>
            candidate.featureId !== undefined &&
            Math.abs((getPosition(candidate.featureId) / 100) * metrics.width - offsetX) <= GRAB_RADIUS_PX
        );
        if (grabbed === undefined) {
            return false;
        }
        beginDrag(grabbed);
        return true;
    }, [images, geojson, routeTimes]);

    const containerPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponderCapture: (evt) => tryBeginDragAt(evt),
        onMoveShouldSetPanResponderCapture: () => isDraggingPlayerRef.current,
        onPanResponderMove: (evt) => {
            const metrics = containerMetricsRef.current;
            if (metrics.width <= 0) {
                return;
            }
            const positionPercent = ((evt.nativeEvent.pageX - metrics.pageX) / metrics.width) * 100;
            const closestFeature = getClosestFeatureFromPosition(positionPercent);
            if (closestFeature !== null) {
                draggingClosestFeature$.next(closestFeature);
            }
        },
        onPanResponderRelease: endDrag,
        onPanResponderTerminate: endDrag,
    }), [tryBeginDragAt, geojson, routeTimes]);

    const draggingFeaturePosition = draggingClosestFeature !== null
        ? getPosition(draggingClosestFeature.properties.id)
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
                            style={[styles.marker, isDragged ? styles.dragMarker : undefined, { left: `${getPosition(image.featureId!).toFixed(0)}%` }]}
                        >
                            <View style={[styles.markerHead, { backgroundColor: color }]} />
                            <View style={[styles.markerLine, { backgroundColor: color }]} />
                            <View style={[styles.markerFoot, { backgroundColor: color }]} />
                        </View>
                    );
                })}
            {draggingFeaturePosition !== null ? (
                <View
                    style={[styles.marker, styles.dragMarker, { left: `${draggingFeaturePosition.toFixed(0)}%` }]}
                >
                    <View style={[styles.markerHead, { backgroundColor: markerHighlightColor }]} />
                    <View style={[styles.markerLine, { backgroundColor: markerHighlightColor }]} />
                    <View style={[styles.markerFoot, { backgroundColor: markerHighlightColor }]} />
                </View>
            ) : null}
        </View>
    );
};
