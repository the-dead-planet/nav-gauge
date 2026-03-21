import { FeatureStateProps } from "@apparatus";
import { IMAGE_PROPERTY, IMAGE_THUMBNAIL_PROPERTY } from "./images-sources";
import { getImageIconSize, IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE, IMAGE_THUMBNAIL_SIZE } from "../images";
import { GetProperty, Opacity } from "./model";

export const imageSourceIds = {
    thumbnails: 'route-story-thumbnails',
    imageInDisplay: 'route-story-image-in-display',
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

const thumbnailIconImage: GetProperty = ['get', IMAGE_THUMBNAIL_PROPERTY];
const thumbnailIconSize: number = getImageIconSize(IMAGE_THUMBNAIL_SIZE, IMAGE_MARKER_SIZE);
const dragOpacity = .4;
const thumbnailDraggingOpacity: Opacity = [
    'case',
    ["==", ["feature-state", FeatureStateProps.Dragging], true],
    dragOpacity,
    1
];

const inDisplayIconImage: GetProperty = ['get', IMAGE_PROPERTY];

export default {
    thumbnailsOutline: {
        circleRadius: Math.round(IMAGE_MARKER_SIZE / 2),
        circleColor: 'transparent',
        circleStrokeColor: 'white',
        circleStrokeWidth: 2,
        circleStrokeOpacity: thumbnailDraggingOpacity,
    },
    thumbnails: {
        iconImage: thumbnailIconImage,
        iconSize: thumbnailIconSize,
        iconAllowOverlap: true,
        iconOpacity: thumbnailDraggingOpacity,
    },
    thumbnailsHighlightOutline: {
        circleRadius: Math.round(IMAGE_MARKER_SIZE / 2) * 1.1,
        circleColor: 'transparent',
        circleStrokeColor: 'green',
        circleStrokeWidth: 2,
    },
    thumbnailsHighlight: {
        iconImage: thumbnailIconImage,
        iconSize: thumbnailIconSize * 1.1,
        iconAllowOverlap: true,
        iconOpacity: 1,
    },
    imageInDisplay: {
        iconImage: inDisplayIconImage,
        iconSize: getImageIconSize(IMAGE_IN_DISPLAY_SIZE, IMAGE_MARKER_SIZE),
        iconAllowOverlap: true,
    }
};
