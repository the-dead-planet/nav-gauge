import { FeatureStateProps } from "@apparatus";
import { DRAGGED_IMAGE_ID, IMAGE_PROPERTY, IMAGE_THUMBNAIL_PROPERTY } from "./images-sources";
import { getImageIconSize, FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE, MAP_THUMBNAIL_SIZE } from "../images";
import { ComparisonProperty, GetProperty, CaseFeatureStateOrPropertyCondition } from "./model";
import { BehaviorSubject } from "rxjs";

export const imageSourceIds = {
    thumbnails: 'route-story-thumbnails',
}

/**
 * Keys follow layer order.
 */
export const imageLayerIds = {
    thumbnailsOutline: 'route-story-thumbnails-outline',
    thumbnails: 'route-story-thumbnails',
    thumbnailsHighlightOutline: 'route-story-thumbnails-highlight-outline',
    thumbnailsHighlight: 'route-story-thumbnails-highlight',
    imageInDisplay: 'route-story-image-in-display',
}

export const highlightIdsBySourceId$ = new BehaviorSubject<Map<string, Set<string>>>(new Map());
export const draggingImageId$ = new BehaviorSubject<number | null>(null);
export const draggingFeatureId$ = new BehaviorSubject<number | null>(null);

const thumbnailsFilter: ComparisonProperty = ['!=', ['get', 'imageId'], DRAGGED_IMAGE_ID];
const thumbnailIconImage: GetProperty = ['get', IMAGE_THUMBNAIL_PROPERTY];
const thumbnailIconSize: number = getImageIconSize(MAP_THUMBNAIL_SIZE, THUMBNAIL_IMAGE_SIZE);
const dragOpacity = .4;
const thumbnailDraggingOpacity: CaseFeatureStateOrPropertyCondition = [
    'case',
    [
        'any',
        ["==", ["feature-state", FeatureStateProps.Dragging], true],
        ["==", ["get", FeatureStateProps.Dragging], true]
    ],
    dragOpacity,
    1
];
const thumbnailsOutlineStrokeWidth: CaseFeatureStateOrPropertyCondition = [
    'case',
    [
        'any',
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        ['==', ['get', FeatureStateProps.Highlight], true]
    ],
    3,
    2
];
const thumbnailsOutlineStrokeColor: CaseFeatureStateOrPropertyCondition = [
    'case',
    [
        'any',
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        ['==', ['get', FeatureStateProps.Highlight], true]
    ],
    'green',
    'white'
];

const thumbnailsHighlightOutlineFilter: ComparisonProperty = ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID];
const thumbnailsHighlightFilter: ComparisonProperty = ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID];

const inDisplayIconImage: GetProperty = ['get', IMAGE_PROPERTY];

export default {
    thumbnailsOutline: {
        paint: {
            "circle-radius": Math.round(THUMBNAIL_IMAGE_SIZE / 2),
            'circle-color': 'transparent',
            'circle-stroke-color': thumbnailsOutlineStrokeColor,
            'circle-stroke-width': thumbnailsOutlineStrokeWidth,
            'circle-stroke-opacity': thumbnailDraggingOpacity,
        },
    },
    thumbnails: {
        filter: thumbnailsFilter,
        layout: {
            'icon-image': thumbnailIconImage,
            'icon-size': thumbnailIconSize,
            'icon-allow-overlap': true,
        },
        paint: {
            'icon-opacity': thumbnailDraggingOpacity,
        }
    },
    thumbnailsHighlightOutline: {
        filter: thumbnailsHighlightOutlineFilter,
        paint: {
            'circle-radius': Math.round(THUMBNAIL_IMAGE_SIZE / 2) * 1.1,
            'circle-color': 'transparent',
            'circle-stroke-color': 'green',
            'circle-stroke-width': 2,
        },
    },
    thumbnailsHighlight: {
        filter: thumbnailsHighlightFilter,
        layout: {
            'icon-image': thumbnailIconImage,
            'icon-size': thumbnailIconSize * 1.1,
            'icon-allow-overlap': true,
        },
        paint: {
            'icon-opacity': 1,
        },
    },
    imageInDisplay: {
        getFilter: (displayImageId: number | null): ComparisonProperty => ['==', ['get', 'imageId'], displayImageId ?? -1],
        layout: {
            'icon-image': inDisplayIconImage,
            'icon-size': getImageIconSize(FULL_SIZE_IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE),
            'icon-allow-overlap': true,
        }
    }
};
