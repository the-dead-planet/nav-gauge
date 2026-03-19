import { LayerSpecificationWithBeforeId } from "@apparatus";
import { imageLayerIds, ImagesLayers, imageSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { ThemeName } from "@ui";
import { SymbolLayerSpecification } from "maplibre-gl";

// TODO: Dependent on base map style
export const getImagesLayers = (_themeName: ThemeName): LayerSpecificationWithBeforeId[] => {
    const thumbnailsLayer: LayerSpecificationWithBeforeId = {
        beforeLayerId: imageLayerIds.thumbnailsHighlight,
        id: imageLayerIds.thumbnails,
        source: imageSourceIds.thumbnails,
        type: 'symbol',
        layout: {
            'icon-image': ImagesLayers.thumbnails.iconImage,
            'icon-size': ImagesLayers.thumbnails.iconSize,
            'icon-allow-overlap': ImagesLayers.thumbnails.iconAllowOverlap,
        },
        paint: {
            'icon-opacity': ImagesLayers.thumbnails.iconOpacity
        }
    };

    return [
        {
            beforeLayerId: imageLayerIds.thumbnails,
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
        thumbnailsLayer,
        {
            ...thumbnailsLayer,
            beforeLayerId: imageLayerIds.imageInDisplay,
            id: imageLayerIds.thumbnailsHighlight,
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
