import { LayerSpecification, SymbolLayerSpecification } from "maplibre-gl";
import { DRAGGED_IMAGE_ID, imageLayerIds, ImagesLayers, imageSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { ThemeName } from "@ui";

// TODO: Dependent on base map style
export const getImagesLayers = (_themeName: ThemeName,): LayerSpecification[] => {
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
            filter: ['!=', ['get', 'imageId'], DRAGGED_IMAGE_ID],
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
            filter: ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID],
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
            filter: ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID],
            layout: {
                'icon-image': ImagesLayers.thumbnailsHighlight.iconImage,
                'icon-size': ImagesLayers.thumbnailsHighlight.iconSize,
                'icon-allow-overlap': ImagesLayers.thumbnailsHighlight.iconAllowOverlap,
            },
            paint: {
                'icon-opacity': ImagesLayers.thumbnailsHighlight.iconOpacity,
            }
        },
    ];
}

export const displayImageLayers: SymbolLayerSpecification[] = [
    {
        id: imageLayerIds.imageInDisplay,
        type: 'symbol',
        source: imageSourceIds.imageInDisplay,
        layout: {
            'icon-image': ImagesLayers.imageInDisplay.iconImage,
            'icon-size': ImagesLayers.imageInDisplay.iconSize,
            'icon-allow-overlap': ImagesLayers.imageInDisplay.iconAllowOverlap,
        }
    }
];
