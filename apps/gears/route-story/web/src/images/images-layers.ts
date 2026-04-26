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
            paint: ImagesLayers.thumbnailsOutline.paint,
        },
        {
            id: imageLayerIds.thumbnails,
            source: imageSourceIds.thumbnails,
            type: 'symbol',
            filter: ImagesLayers.thumbnails.filter,
            layout: ImagesLayers.thumbnails.layout,
            paint: ImagesLayers.thumbnails.paint
        },
        {
            id: imageLayerIds.thumbnailsHighlightOutline,
            source: imageSourceIds.thumbnails,
            type: 'circle',
            filter: ImagesLayers.thumbnailsHighlightOutline.filter,
            paint: ImagesLayers.thumbnailsHighlightOutline.paint,
        },
        {
            id: imageLayerIds.thumbnailsHighlight,
            source: imageSourceIds.thumbnails,
            type: 'symbol',
            filter: ImagesLayers.thumbnailsHighlight.filter,
            layout: ImagesLayers.thumbnailsHighlight.layout,
            paint: ImagesLayers.thumbnailsHighlight.paint,
        },
        {
            id: imageLayerIds.imageInDisplay,
            type: 'symbol',
            filter: ImagesLayers.imageInDisplay.getFilter(displayImageId),
            source: imageSourceIds.thumbnails,
            layout: ImagesLayers.imageInDisplay.layout
        }
    ];
};
