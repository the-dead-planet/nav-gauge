import { FC, useMemo } from "react";
import {
    Layer,
    Images,
    GeoJSONSource,
    ImageEntry,
} from "@maplibre/maplibre-react-native";
import { resolveMapImageMarkerColors, useTheme } from "@ui";
import { OverlayComponentProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    getIconImageId,
    getImageSource,
    getImageSourceWithDraggingState,
    getImageSourceWithMarkerVisibility,
    getImageSourceWithAnchors,
    IMAGE_MARKER_ANCHOR_ID,
    IMAGE_MARKER_ANCHOR_SDF_URI,
    getImageMarkerConnections,
    ImagesLayers,
    routeLayerIds,
    imageLayerIds,
    imageSourceIds,
    draggingImage$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { useLoadedMobileImages } from "./useLoadedMobileImages";
import { useImageInDisplay } from "./useImageInDisplay";
import { useImageMarkerSource } from "./useImageMarkerSource";
import { useMapImageInteraction } from "./useMapImageInteraction";
import { ImageDragPreview } from "./ImageDragPreview";
import { MobileRouteStoryProps } from "../model";
import { CircularMapThumbnail } from "./CircularMapThumbnail";
import { ImageCountBadges } from './ImageCountBadges';

export const ImagesLayer: FC<
    OverlayComponentProps<MobileMap> & MobileRouteStoryProps
> = ({
    map,
    animatrix,
    data$,
    state$,
    routeGeometryData$,
    images$,
    playerOperator,
}) => {
    const theme = useTheme();
    const { defaultColor: imageColor, hoverColor: imageHoverColor, activeColor: imageActiveColor } = resolveMapImageMarkerColors(theme);
    const badgeAppearance = theme.resolveAppearance("fill", "tertiary");
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const [{ geojson }] = useSubjectState(data$);
    const [routeGeometryData] = useSubjectState(routeGeometryData$);
    const [images] = useSubjectState(images$);
    const [{ markerLayerVisibility }] = useSubjectState(state$);
    const [draggingImage] = useSubjectState(draggingImage$);
    const loadedImages = useLoadedMobileImages(images);
    const originalSource = useMemo(
        () => getImageSource(loadedImages, geojson, routeGeometryData),
        [loadedImages, geojson, routeGeometryData],
    );
    const groupedSource = useImageMarkerSource(
        map,
        originalSource,
        displayImageId !== null,
    );
    const visibleSource = useMemo(() => getImageSourceWithMarkerVisibility(groupedSource, markerLayerVisibility), [groupedSource, markerLayerVisibility]);
    useMapImageInteraction(map, images$, geojson, routeGeometryData, markerLayerVisibility);
    const renderedSource = useMemo(
        () =>
            getImageSourceWithDraggingState(
                getImageSourceWithAnchors(originalSource, visibleSource),
                draggingImage?.id ?? null,
            ),
        [originalSource, visibleSource, draggingImage],
    );

    const imageSources: Record<string, ImageEntry> = Object.fromEntries(
        loadedImages.flatMap((image) => {
            const fullSize: [string, ImageEntry] = [
                getIconImageId(image),
                { source: { uri: image.data.fullSize } },
            ];
            return displayImageId === image.id
                ? [fullSize]
                : [];
        }),
    );
    imageSources[IMAGE_MARKER_ANCHOR_ID] = {
        source: { uri: IMAGE_MARKER_ANCHOR_SDF_URI, scale: 4 },
        sdf: true,
    };
    const imageInDisplayIconSize = useImageInDisplay(
        map,
        animatrix,
        playerOperator,
    );

    return (
        <>
            <Images images={imageSources} />
            <ImageCountBadges backgroundColor={imageColor} textColor={badgeAppearance.glyphs} />
            {loadedImages.map((image) => (
                <CircularMapThumbnail
                    key={`${image.id}:${image.data.thumbnail}`}
                    imageId={getIconImageId(image, { thumbnail: true })}
                    uri={image.data.thumbnail}
                />
            ))}
            <GeoJSONSource
                id={imageSourceIds.connections}
                data={getImageMarkerConnections(originalSource, visibleSource)}
            >
                <Layer
                    type="line"
                    id={imageLayerIds.connections}
                    afterId={routeLayerIds.currentPoint}
                    paint={ImagesLayers.connections.paint}
                />
            </GeoJSONSource>
            <GeoJSONSource id={imageSourceIds.thumbnails} data={renderedSource}>
                <Layer
                    type="symbol"
                    id={imageLayerIds.anchors}
                    afterId={imageLayerIds.connections}
                    filter={ImagesLayers.anchors.filter}
                    layout={ImagesLayers.anchors.layout}
                    paint={ImagesLayers.anchors.getPaint(imageColor, imageHoverColor, imageActiveColor)}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsStackBack}
                    afterId={imageLayerIds.anchors}
                    {...ImagesLayers.thumbnailsStackBack}
                    layout={ImagesLayers.thumbnailsStackBack.layout}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnailsStackFront}
                    {...ImagesLayers.thumbnailsStackFront}
                    layout={ImagesLayers.thumbnailsStackFront.layout}
                />
                <Layer
                    type="circle"
                    id={imageLayerIds.thumbnailsOutline}
                    filter={ImagesLayers.thumbnailsOutline.filter}
                    paint={ImagesLayers.thumbnailsOutline.getPaint(
                        imageColor,
                        imageHoverColor,
                        imageActiveColor,
                    )}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.thumbnails}
                    filter={ImagesLayers.thumbnails.filter}
                    layout={ImagesLayers.thumbnails.layout}
                    paint={ImagesLayers.thumbnails.paint}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.countBadge}
                    filter={ImagesLayers.countBadge.filter}
                    layout={ImagesLayers.countBadge.getLayout(
                        imageColor,
                        badgeAppearance.glyphs,
                    )}
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
            <ImageDragPreview source={groupedSource} visible={markerLayerVisibility} />
        </>
    );
};
