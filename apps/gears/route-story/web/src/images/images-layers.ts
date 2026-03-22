import { LayerSpecification } from "maplibre-gl";
import { imageLayerIds, ImagesLayers, imageSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const getImagesLayers = (
    displayImageId: number | null,
): LayerSpecification[] => {
    return [
        {
            id: imageLayerIds.thumbnailsOutline,
            source: imageSourceIds.thumbnails,
            type: 'circle',
            layout: {},
            paint: {
                "circle-radius": ImagesLayers.thumbnailsOutline.circleRadius,
                'circle-color': ImagesLayers.thumbnailsOutline.circleColor,
                'circle-stroke-color': ImagesLayers.thumbnailsOutline.circleStrokeColor,
                'circle-stroke-width': ImagesLayers.thumbnailsOutline.circleStrokeWidth,
                'circle-stroke-opacity': ImagesLayers.thumbnailsOutline.circleStrokeOpacity,
            }
        },
        {
            id: imageLayerIds.thumbnails,
            source: imageSourceIds.thumbnails,
            type: 'symbol',
            filter: ImagesLayers.thumbnailsFilter,
            layout: {
                'icon-image': ImagesLayers.thumbnails.iconImage,
                'icon-size': ImagesLayers.thumbnails.iconSize,
                'icon-allow-overlap': ImagesLayers.thumbnails.iconAllowOverlap,
            },
            paint: {
                'icon-opacity': ImagesLayers.thumbnails.iconOpacity
            }
        },
        {
            id: imageLayerIds.thumbnailsHighlightOutline,
            source: imageSourceIds.thumbnails,
            type: 'circle',
            filter: ImagesLayers.thumbnailsHighlightOutlineFilter,
            layout: {},
            paint: {
                "circle-radius": ImagesLayers.thumbnailsHighlightOutline.circleRadius,
                'circle-color': ImagesLayers.thumbnailsHighlightOutline.circleColor,
                'circle-stroke-color': ImagesLayers.thumbnailsHighlightOutline.circleStrokeColor,
                'circle-stroke-width': ImagesLayers.thumbnailsHighlightOutline.circleStrokeWidth,
            }
        },
        {
            id: imageLayerIds.thumbnailsHighlight,
            source: imageSourceIds.thumbnails,
            type: 'symbol',
            filter: ImagesLayers.thumbnailsHighlightFilter,
            layout: {
                'icon-image': ImagesLayers.thumbnailsHighlight.iconImage,
                'icon-size': ImagesLayers.thumbnailsHighlight.iconSize,
                'icon-allow-overlap': ImagesLayers.thumbnailsHighlight.iconAllowOverlap,
            },
            paint: {
                'icon-opacity': ImagesLayers.thumbnailsHighlight.iconOpacity,
            }
        },
        {
            id: imageLayerIds.imageInDisplay,
            type: 'symbol',
            filter: ImagesLayers.getImageInDisplayFilter(displayImageId),
            source: imageSourceIds.thumbnails,
            layout: {
                'icon-image': ImagesLayers.imageInDisplay.iconImage,
                'icon-size': ImagesLayers.imageInDisplay.iconSize,
                'icon-allow-overlap': ImagesLayers.imageInDisplay.iconAllowOverlap,
            }
        }
    ];
};
