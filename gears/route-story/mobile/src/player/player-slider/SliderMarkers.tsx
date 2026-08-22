import { FC, useMemo, useRef } from "react";
import { PanResponder, Pressable, StyleSheet, View, type HostInstance } from "react-native";
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

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 8,
        right: 8,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    marker: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
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

    const markerColor = theme.color('tertiary', 500);
    const markerHighlightColor = theme.color('tertiary', theme.isDark ? 300 : 600);

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

    // ponytail: capture-phase steal only while a player-marker drag is active, so slider touches pass through untouched
    const containerPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponderCapture: () => false,
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
    }), []);

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

                    return (
                        <Pressable
                            key={image.id}
                            accessibilityLabel={`${imageLabel} ${image.id}`}
                            onPress={() => beginDrag(image)}
                            style={[styles.marker, {
                                left: `${getPosition(image.featureId!).toFixed(0)}%`,
                                backgroundColor: highlighted || isDragged ? markerHighlightColor : markerColor,
                                borderColor: theme.componentColor('text'),
                            }]}
                        />
                    );
                })}
            {draggingFeaturePosition !== null ? (
                <View
                    style={[styles.marker, styles.dragMarker, {
                        left: `${draggingFeaturePosition.toFixed(0)}%`,
                        backgroundColor: markerHighlightColor,
                        borderColor: theme.componentColor('text'),
                    }]}
                />
            ) : null}
        </View>
    );
};
