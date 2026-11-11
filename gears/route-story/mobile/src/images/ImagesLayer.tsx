import { FC, useMemo } from "react";
import {
    Layer,
    Images,
    GeoJSONSource,
    ImageEntry,
    Marker,
} from "@maplibre/maplibre-react-native";
import { StyleSheet, View } from "react-native";
import { Chip, Text } from "@mobile-ui";
import { useTheme } from "@ui";
import { OverlayComponentProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    getIconImageId,
    getImageSource,
    getDraggingImageSource,
    getImageMarkerConnections,
    formatImageMarkerCount,
    ImagesLayers,
    routeLayerIds,
    imageLayerIds,
    imageSourceIds,
    draggingImage$,
    draggingPlacement$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { useImageMarkerSource } from "./useImageMarkerSource";
import { useMapImageInteraction } from "./useMapImageInteraction";
import { MobileRouteStoryProps } from "../model";

const styles = StyleSheet.create({
    badgeNumber: {
        fontSize: 11,
        lineHeight: 12,
    },
});

export const ImagesLayer: FC<
    OverlayComponentProps<MobileMap> & MobileRouteStoryProps
> = ({
    map,
    animatrix,
    data$,
    routeGeometryData$,
    images$,
    playerOperator,
}) => {
    const theme = useTheme();
    const imageHighlightColor = theme.color("tertiary", 500);
    const badgeAppearance = theme.resolveAppearance("fill", "tertiary");
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [images] = useSubjectState(images$);
    const [draggingPlacement] = useSubjectState(draggingPlacement$);
    const loadedImages = useLoadedMobileImages(images);
    const [showImageMarkers] = useSubjectState(
        playerOperator.showImageMarkers$,
    );
    const originalSource = useMemo(
        () => getImageSource(loadedImages, geojson, routeGeometryData),
        [loadedImages, geojson, routeGeometryData],
    );
    const groupedSource = useImageMarkerSource(
        map,
        originalSource,
        displayImageId !== null,
    );
    const mapInteractionSource = useMapImageInteraction(
        map,
        groupedSource,
        images$,
        geojson,
        routeGeometryData,
        playerOperator.showImageMarkers$,
    );
    const draggingImage = draggingImage$.value;
    const renderedSource =
        draggingImage?.interaction === "player"
            ? getDraggingImageSource(
                  groupedSource,
                  draggingImage.id,
                  draggingPlacement,
              )
            : mapInteractionSource;
    const visibility = showImageMarkers ? "visible" : "none";

    const imageSources: Record<string, ImageEntry> = Object.fromEntries(
        loadedImages.flatMap((image) => {
            const thumbnail: [string, ImageEntry] = [
                getIconImageId(image, { thumbnail: true }),
                { source: { uri: image.data.thumbnail } },
            ];
            const fullSize: [string, ImageEntry] = [
                getIconImageId(image),
                { source: { uri: image.data.fullSize } },
            ];
            return displayImageId === image.id
                ? [fullSize, thumbnail]
                : [thumbnail];
        }),
    );
    const imageInDisplayIconSize = useImageInDisplay(
        map,
        animatrix,
        playerOperator,
    );

    return (
        <>
            <Images images={imageSources} />
            <GeoJSONSource
                id={imageSourceIds.connections}
                data={getImageMarkerConnections(originalSource, groupedSource)}
            >
                <Layer
                    type="line"
                    id={imageLayerIds.connections}
                    afterId={routeLayerIds.currentPoint}
                    paint={ImagesLayers.connections.paint}
                    layout={{ visibility }}
                />
            </GeoJSONSource>
            <GeoJSONSource id={imageSourceIds.thumbnails} data={renderedSource}>
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsStackBack}
                    afterId={imageLayerIds.connections}
                    {...ImagesLayers.thumbnailsStackBack}
                    layout={{
                        ...ImagesLayers.thumbnailsStackBack.layout,
                        visibility,
                    }}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsStackFront}
                    {...ImagesLayers.thumbnailsStackFront}
                    layout={{
                        ...ImagesLayers.thumbnailsStackFront.layout,
                        visibility,
                    }}
                />
                <Layer
                    type="circle"
                    id={imageLayerIds.thumbnailsOutline}
                    filter={ImagesLayers.thumbnailsOutline.filter}
                    layout={{ visibility }}
                    paint={ImagesLayers.thumbnailsOutline.getPaint(
                        imageHighlightColor,
                    )}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnails}
                    filter={ImagesLayers.thumbnails.filter}
                    layout={{ ...ImagesLayers.thumbnails.layout, visibility }}
                    paint={ImagesLayers.thumbnails.paint}
                />
                <Layer
                    type="circle"
                    id={imageLayerIds.thumbnailsHighlightOutline}
                    filter={ImagesLayers.thumbnailsHighlightOutline.filter}
                    layout={{ visibility }}
                    paint={ImagesLayers.thumbnailsHighlightOutline.getPaint(
                        imageHighlightColor,
                    )}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsHighlight}
                    filter={ImagesLayers.thumbnailsHighlight.filter}
                    layout={{
                        ...ImagesLayers.thumbnailsHighlight.layout,
                        visibility,
                    }}
                    paint={ImagesLayers.thumbnailsHighlight.paint}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.imageInDisplay}
                    filter={ImagesLayers.imageInDisplay.getFilter(
                        displayImageId,
                    )}
                    layout={{
                        ...ImagesLayers.imageInDisplay.layout,
                        "icon-size": imageInDisplayIconSize,
                    }}
                />
            </GeoJSONSource>
            {showImageMarkers &&
                groupedSource.features
                    .filter(
                        ({ properties }) =>
                            properties.markerVisible &&
                            (properties.markerCount ?? 1) > 1,
                    )
                    .map((feature) => (
                        <Marker
                            key={feature.id}
                            lngLat={[
                                feature.geometry.coordinates[0],
                                feature.geometry.coordinates[1],
                            ]}
                            offset={[20, -20]}
                            pointerEvents="none"
                        >
                            <View pointerEvents="none">
                                <Chip size="xs" color="tertiary" variant="fill">
                                    <Text
                                        style={[
                                            styles.badgeNumber,
                                            { color: badgeAppearance.glyphs },
                                        ]}
                                    >
                                        {formatImageMarkerCount(
                                            feature.properties.markerCount ?? 1,
                                        )}
                                    </Text>
                                </Chip>
                            </View>
                        </Marker>
                    ))}
        </>
    );
};
