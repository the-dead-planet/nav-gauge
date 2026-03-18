import { CircleLayerSpecification, LayerSpecification, LineLayerSpecification, SymbolLayerSpecification } from "@maplibre/maplibre-gl-style-spec";
import { FeatureStateProps, LoadedImageData } from "@apparatus";
import { ThemeName } from "@ui";
import { getImageIconSize, IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE, IMAGE_THUMBNAIL_SIZE } from "./images";
import { GeoJson } from "@tinker-chest";
import { getIconImageId } from "./tinkers";

export const colorActive = '#003161';
export const colorInactive = 'grey';

export const sourceIds = {
    currentPoint: 'route-current-point',
    line: 'route-line',
    image: 'route-image',
    imageInDisplay: 'route-image-in-display',
}

export const layerIds = {
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
    points: 'route-points',
    line: 'route-line',
    images: 'route-images',
    imagesHighlight: 'route-images-highlight',
    imagesHighlightOutline: 'route-images-highlight-outline',
    imageInDisplay: 'route-image-in-display',
}

export const routeLineLayer: LineLayerSpecification = {
    id: layerIds.line,
    source: sourceIds.line,
    type: 'line',
    paint: {
        'line-color': [
            'case',
            ['==', ['get', 'status'], 'before'],
            colorActive,
            colorInactive
        ],
        'line-width': 2,
        'line-opacity': .6,
    },
    layout: {
        'line-cap': 'round',
        'line-join': 'round'
    }
};

export const routePointsLayer: CircleLayerSpecification = {
    id: layerIds.points,
    source: sourceIds.line,
    type: 'circle',
    paint: {
        'circle-color': [
            'case',
            ["==", ["feature-state", FeatureStateProps.Highlight], true],
            'red',
            ['==', ['get', 'status'], 'before'],
            colorActive,
            colorInactive
        ],
        'circle-radius': 3,
    }
};

export const currentPointLayers: CircleLayerSpecification[] = [
    {
        id: layerIds.currentPointOutline,
        source: sourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': 'white',
            'circle-radius': 7,
        }
    },
    {
        id: layerIds.currentPoint,
        source: sourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': colorActive,
            'circle-radius': 5,
        }
    }
];

export const IMAGE_PROPERTY = 'iconImageId';
export const IMAGE_THUMBNAIL_PROPERTY = 'iconImageThumbnailId';

export type ImageFeature = GeoJSON.Feature<GeoJSON.Point, ImageFeatureProperties>;
export interface ImageFeatureProperties {
    imageId: number;
    [IMAGE_PROPERTY]: string;
    [IMAGE_THUMBNAIL_PROPERTY]: string;
}

export function getImageSource<TImageData>(
    loadedImages: LoadedImageData<TImageData>[],
    geojson?: GeoJson
): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> {
    return {
        type: 'FeatureCollection',
        features: loadedImages.reduce<ImageFeature[]>((acc, image) => {
            const feature = geojson?.features.find((f) => f.properties.id === image.featureId);
            if (feature) {
                acc.push({
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: image.id,
                        [IMAGE_PROPERTY]: getIconImageId(image),
                        [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, { thumbnail: true }),
                    }
                });
            }
            return acc;
        }, [])
    };
}

// TODO: Depoendent on base map style
export const getImagesLayers = (_themeName: ThemeName): LayerSpecification[] => {
    const imageLayer: LayerSpecification = {
        id: layerIds.images,
        source: sourceIds.image,
        type: 'symbol',
        layout: {
            'icon-image': ['get', IMAGE_THUMBNAIL_PROPERTY],
            'icon-size': getImageIconSize(IMAGE_THUMBNAIL_SIZE, IMAGE_MARKER_SIZE),
            'icon-allow-overlap': true,
        },
        paint: {
            'icon-opacity': [
                'case',
                ["==", ["feature-state", FeatureStateProps.Dragging], true],
                0.5,
                1
            ]
        }
    };

    return [
        {
            id: layerIds.imagesHighlightOutline,
            source: sourceIds.image,
            type: 'circle',
            layout: {},
            paint: {
                'circle-color': 'transparent',
                'circle-stroke-color': 'white',
                'circle-stroke-width': 2,
                "circle-radius": Math.round(IMAGE_MARKER_SIZE / 2),
                'circle-stroke-opacity': [
                    'case',
                    ["==", ["feature-state", FeatureStateProps.Dragging], true],
                    0.5,
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    1,
                    0
                ]
            }
        },
        imageLayer,
        {
            ...imageLayer,
            id: layerIds.imagesHighlight,
            paint: {
                'icon-opacity': [
                    'case',
                    ["==", ["feature-state", FeatureStateProps.Dragging], true],
                    0.5,
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    1,
                    0
                ]
            }
        },
    ];
}

export const ANIMATION_DURATION = 250;

export const getDisplayImageLayers = (): SymbolLayerSpecification[] => {
    return [{
        id: layerIds.imageInDisplay,
        type: 'symbol',
        source: sourceIds.imageInDisplay,
        layout: {
            'icon-image': ['get', IMAGE_PROPERTY],
            'icon-size': getImageIconSize(IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE),
            'icon-allow-overlap': true,
        },
        paint: {
            'icon-opacity': 1
        },
    }];
};
