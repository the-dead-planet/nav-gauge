import { LayerSpecification } from "maplibre-gl";
import {
    imageLayerIds,
    ImagesLayers,
    imageSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const getImagesLayers = (
    displayImageId: number | null,
    highlightColor: string,
    badgeTextColor: string,
): LayerSpecification[] => {
    return [
        {
            id: imageLayerIds.thumbnailsStackBack,
            source: imageSourceIds.thumbnails,
            type: "symbol",
            ...ImagesLayers.thumbnailsStackBack,
        },
        {
            id: imageLayerIds.thumbnailsStackFront,
            source: imageSourceIds.thumbnails,
            type: "symbol",
            ...ImagesLayers.thumbnailsStackFront,
        },
        {
            id: imageLayerIds.thumbnailsOutline,
            source: imageSourceIds.thumbnails,
            type: "circle",
            filter: ImagesLayers.thumbnailsOutline.filter,
            paint: ImagesLayers.thumbnailsOutline.getPaint(highlightColor),
        },
        {
            id: imageLayerIds.thumbnails,
            source: imageSourceIds.thumbnails,
            type: "symbol",
            filter: ImagesLayers.thumbnails.filter,
            layout: ImagesLayers.thumbnails.layout,
            paint: ImagesLayers.thumbnails.paint,
        },
        {
            id: imageLayerIds.countBadge,
            source: imageSourceIds.thumbnails,
            type: "symbol",
            filter: ImagesLayers.countBadge.filter,
            layout: ImagesLayers.countBadge.layout,
            paint: ImagesLayers.countBadge.getPaint(highlightColor),
        },
        {
            id: imageLayerIds.countLabel,
            source: imageSourceIds.thumbnails,
            type: "symbol",
            filter: ImagesLayers.countLabel.filter,
            layout: ImagesLayers.countLabel.layout,
            paint: ImagesLayers.countLabel.getPaint(badgeTextColor),
        },
        {
            id: imageLayerIds.imageInDisplay,
            type: "symbol",
            filter: ImagesLayers.imageInDisplay.getFilter(displayImageId),
            source: imageSourceIds.thumbnails,
            layout: ImagesLayers.imageInDisplay.layout,
        },
    ];
};

export const getImageDragPreviewLayers = (
    highlightColor: string,
): LayerSpecification[] => [
    {
        id: imageLayerIds.thumbnailsHighlightOutline,
        source: imageSourceIds.dragPreview,
        type: "circle",
        filter: ImagesLayers.thumbnailsHighlightOutline.filter,
        paint: ImagesLayers.thumbnailsHighlightOutline.getPaint(highlightColor),
    },
    {
        id: imageLayerIds.thumbnailsHighlight,
        source: imageSourceIds.dragPreview,
        type: "symbol",
        filter: ImagesLayers.thumbnailsHighlight.filter,
        layout: ImagesLayers.thumbnailsHighlight.layout,
        paint: ImagesLayers.thumbnailsHighlight.paint,
    },
];
