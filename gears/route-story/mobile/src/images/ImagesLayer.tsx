import { FC, useMemo } from "react";
import {
    Layer,
    Images,
    GeoJSONSource,
    ImageEntry,
} from "@maplibre/maplibre-react-native";
import { useTheme } from "@ui";
import { OverlayComponentProps } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    getIconImageId,
    getImageSource,
    getImageSourceWithDraggingState,
    getImageMarkerConnections,
    IMAGE_COUNT_BADGE_ID,
    IMAGE_BADGE_SDF_URI,
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
    useMapImageInteraction(map, images$, geojson, routeGeometryData);
    const renderedSource = useMemo(
        () =>
            getImageSourceWithDraggingState(
                groupedSource,
                draggingImage?.id ?? null,
            ),
        [groupedSource, draggingImage],
    );

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
    imageSources[IMAGE_COUNT_BADGE_ID] = {
        source: { uri: IMAGE_BADGE_SDF_URI, scale: 2 },
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
            <GeoJSONSource
                id={imageSourceIds.connections}
                data={getImageMarkerConnections(originalSource, groupedSource)}
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
                    id={imageLayerIds.thumbnailsStackBack}
                    afterId={imageLayerIds.connections}
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
                        imageHighlightColor,
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
                    layout={ImagesLayers.countBadge.layout}
                    paint={ImagesLayers.countBadge.getPaint(
                        imageHighlightColor,
                    )}
                />
                <Layer
                    type="symbol"
                    id={imageLayerIds.countLabel}
                    filter={ImagesLayers.countLabel.filter}
                    layout={ImagesLayers.countLabel.layout}
                    paint={ImagesLayers.countLabel.getPaint(
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
            <ImageDragPreview source={groupedSource} />
        </>
    );
};
