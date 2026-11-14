import { FeatureStateProps } from "@apparatus";
import {
    DRAGGED_IMAGE_ID,
    IMAGE_PROPERTY,
    IMAGE_THUMBNAIL_PROPERTY,
} from "./images-sources";
import {
    getImageIconSize,
    FULL_SIZE_IMAGE_SIZE,
    THUMBNAIL_IMAGE_SIZE,
    MAP_THUMBNAIL_SIZE,
    MAP_IMAGE_MARKER_OFFSET_Y,
} from "../tinkers/images";
import {
    ComparisonProperty,
    GetProperty,
    CaseFeatureStateOrPropertyCondition,
} from "./model";
import { BehaviorSubject } from "rxjs";
import type { RoutePlacement } from "../tinkers";
import { getImageCountBadgeImageName } from './image-count-badges';
import type {
    ExpressionSpecification,
    FilterSpecification,
    SymbolLayerSpecification,
    CircleLayerSpecification,
} from "@maplibre/maplibre-gl-style-spec";

export const imageSourceIds = {
    dragPreview: "route-story-image-drag-preview",
    connections: "route-story-image-connections",
    thumbnails: "route-story-thumbnails",
};

/**
 * Keys follow layer order.
 */
export const imageLayerIds = {
    connections: "route-story-image-connections",
    anchors: "route-story-image-anchors",
    thumbnailsStackBack: "route-story-thumbnails-stack-back",
    thumbnailsStackFront: "route-story-thumbnails-stack-front",
    thumbnailsOutline: "route-story-thumbnails-outline",
    thumbnails: "route-story-thumbnails",
    dragAnchor: "route-story-image-drag-anchor",
    thumbnailsHighlightOutline: "route-story-thumbnails-highlight-outline",
    thumbnailsHighlight: "route-story-thumbnails-highlight",
    countBadge: "route-story-image-count-badge",
    imageInDisplay: "route-story-image-in-display",
};

export const highlightIdsBySourceId$ = new BehaviorSubject<
    Map<string, Set<string>>
>(new Map());
export const draggingImage$ = new BehaviorSubject<{
    interaction: "map" | "player";
    id: number;
} | null>(null);
export const draggingPlacement$ = new BehaviorSubject<RoutePlacement | null>(
    null,
);
export const selectedImageId$ = new BehaviorSubject<number | null>(null);
export const IMAGE_MARKER_ANCHOR_ID = 'route-story-image-anchor-hexagon';
const countOffset: [number, number] = [20, MAP_IMAGE_MARKER_OFFSET_Y - 20];
const thumbnailTranslate: [number, number] = [0, MAP_IMAGE_MARKER_OFFSET_Y];
const dragThumbnailTranslate: [number, number] = [0, MAP_IMAGE_MARKER_OFFSET_Y - THUMBNAIL_IMAGE_SIZE * 0.1 / 2];
const countText: ExpressionSpecification = [
    "case",
    [">", ["get", "markerCount"], 9],
    "9+",
    ["to-string", ["get", "markerCount"]],
];
export const expandedImageGroupId$ = new BehaviorSubject<number | null>(null);

export const clearImageMarkerSelection = (): void => {
    selectedImageId$.next(null);
    expandedImageGroupId$.next(null);
};

export const toggleImageMarkerGroup = (imageIds: number[]) => {
    if (!imageIds.length) {
        return;
    }
    if (imageIds.some((id) => id === selectedImageId$.value)) {
        clearImageMarkerSelection();
        return;
    }
    const imageId = imageIds[0];
    selectedImageId$.next(imageId);
    expandedImageGroupId$.next(imageId);
};

export const selectMapImageMarker = (imageId: number, groupSize: number) => {
    selectedImageId$.next(
        groupSize > 1 || selectedImageId$.value !== imageId ? imageId : null,
    );
    expandedImageGroupId$.next(groupSize > 1 ? imageId : null);
};

const thumbnailsFilter: FilterSpecification = [
    "all",
    ["!=", ["get", "markerAnchor"], true],
    ["!=", ["get", "imageId"], DRAGGED_IMAGE_ID],
    ["==", ["get", "markerVisible"], true],
];
const groupFilter: FilterSpecification = [
    "all",
    thumbnailsFilter,
    [">", ["get", "markerCount"], 1],
];
const thumbnailIconImage: GetProperty = ["get", IMAGE_THUMBNAIL_PROPERTY];
const thumbnailIconSize: number = getImageIconSize(
    MAP_THUMBNAIL_SIZE,
    THUMBNAIL_IMAGE_SIZE,
);
const dragOpacity = 0.4;
const thumbnailDraggingOpacity: ExpressionSpecification = [
    "*",
    ["coalesce", ["get", "markerOpacity"], 1],
    [
        "case",
        [
            "any",
            ["==", ["feature-state", FeatureStateProps.Dragging], true],
            ["==", ["get", FeatureStateProps.Dragging], true],
        ],
        dragOpacity,
        1,
    ],
];
const thumbnailsOutlineStrokeWidth: CaseFeatureStateOrPropertyCondition = [
    "case",
    [
        "any",
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        ["==", ["get", FeatureStateProps.Highlight], true],
    ],
    3,
    2,
];
const thumbnailsOutlineStrokeColor = (
    defaultColor: string,
    hoverColor: string,
    activeColor: string,
): ExpressionSpecification => [
    "case",
    ['any',
        ['==', ['get', 'markerSelected'], true],
        ['==', ['feature-state', FeatureStateProps.Dragging], true],
        ['==', ['get', FeatureStateProps.Dragging], true],
    ],
    activeColor,
    [
        "any",
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        ["==", ["get", FeatureStateProps.Highlight], true],
    ],
    hoverColor,
    defaultColor,
];

const thumbnailsHighlightFilter: FilterSpecification = ['all',
    ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID],
    ['!=', ['get', 'markerAnchor'], true],
];

const inDisplayIconImage: GetProperty = ["get", IMAGE_PROPERTY];

const thumbnailsStackBack: Pick<
    SymbolLayerSpecification,
    "filter" | "layout" | "paint"
> = {
    filter: groupFilter,
    layout: {
        "icon-image": thumbnailIconImage,
        "icon-size": thumbnailIconSize,
        "icon-allow-overlap": true,
    },
    paint: {
        "icon-translate": [8, MAP_IMAGE_MARKER_OFFSET_Y - 8],
        "icon-translate-anchor": "viewport",
        "icon-opacity": 0.4,
    },
};
const thumbnailsStackFront: typeof thumbnailsStackBack = {
    ...thumbnailsStackBack,
    paint: {
        ...thumbnailsStackBack.paint,
        "icon-translate": [4, MAP_IMAGE_MARKER_OFFSET_Y - 4],
        "icon-opacity": 0.7,
    },
};

const anchorLayout: NonNullable<SymbolLayerSpecification['layout']> = {
    'icon-image': IMAGE_MARKER_ANCHOR_ID,
    'icon-size': 1,
    'icon-allow-overlap': true,
    'icon-pitch-alignment': 'map',
    'icon-rotation-alignment': 'map',
};
const thumbnailPaint: NonNullable<SymbolLayerSpecification['paint']> = {
    'icon-opacity': thumbnailDraggingOpacity,
    'icon-translate': thumbnailTranslate,
    'icon-translate-anchor': 'viewport',
};

export default {
    connections: {
        paint: {
            "line-color": "white",
            "line-width": 1,
            "line-dasharray": [2, 2],
        },
    },
    thumbnailsStackBack,
    thumbnailsStackFront,
    anchors: {
        filter: ['all', ['==', ['get', 'markerAnchor'], true], ['any', ['==', ['get', 'markerVisible'], true], ['==', ['get', 'imageId'], DRAGGED_IMAGE_ID]]] as FilterSpecification,
        layout: anchorLayout,
        getPaint: (defaultColor: string, hoverColor: string, activeColor: string): NonNullable<SymbolLayerSpecification['paint']> => ({
            'icon-color': thumbnailsOutlineStrokeColor(defaultColor, hoverColor, activeColor),
            'icon-opacity': thumbnailDraggingOpacity,
        }),
    },
    thumbnailsOutline: {
        filter: thumbnailsFilter,
        getPaint: (defaultColor: string, hoverColor: string, activeColor: string): NonNullable<CircleLayerSpecification['paint']> => ({
            "circle-radius": Math.round(THUMBNAIL_IMAGE_SIZE / 2),
            "circle-color": "transparent",
            "circle-stroke-color": thumbnailsOutlineStrokeColor(defaultColor, hoverColor, activeColor),
            "circle-stroke-width": thumbnailsOutlineStrokeWidth,
            "circle-stroke-opacity": thumbnailDraggingOpacity,
            "circle-translate": thumbnailTranslate,
            "circle-translate-anchor": 'viewport',
        }),
    },
    thumbnails: {
        filter: thumbnailsFilter,
        layout: {
            "icon-image": thumbnailIconImage,
            "icon-size": thumbnailIconSize,
            "icon-allow-overlap": true,
        },
        paint: thumbnailPaint,
    },
    thumbnailsHighlightOutline: {
        filter: thumbnailsHighlightFilter,
        getPaint: (highlightColor: string): NonNullable<CircleLayerSpecification['paint']> => ({
            "circle-radius": Math.round(THUMBNAIL_IMAGE_SIZE / 2) * 1.1,
            "circle-color": "transparent",
            "circle-stroke-color": highlightColor,
            "circle-stroke-width": 2,
            "circle-translate": dragThumbnailTranslate,
            "circle-translate-anchor": 'viewport',
        }),
    },
    thumbnailsHighlight: {
        filter: thumbnailsHighlightFilter,
        layout: {
            "icon-image": thumbnailIconImage,
            "icon-size": thumbnailIconSize * 1.1,
            "icon-allow-overlap": true,
        },
        paint: {
            ...thumbnailPaint,
            "icon-opacity": 1,
            "icon-translate": dragThumbnailTranslate,
        },
    },
    countBadge: {
        filter: groupFilter,
        getLayout: (backgroundColor: string, textColor: string): NonNullable<SymbolLayerSpecification['layout']> => ({
            "icon-image": ['concat', getImageCountBadgeImageName('', backgroundColor, textColor), countText],
            "icon-size": 1,
            "icon-offset": countOffset,
            "icon-allow-overlap": true,
        }),
    },
    imageInDisplay: {
        getFilter: (displayImageId: number | null): FilterSpecification => ['all',
            ['==', ['get', 'imageId'], displayImageId ?? ''],
            ['!=', ['get', 'markerAnchor'], true],
        ],
        layout: {
            "icon-image": inDisplayIconImage,
            "icon-size": getImageIconSize(
                FULL_SIZE_IMAGE_SIZE,
                THUMBNAIL_IMAGE_SIZE,
            ),
            "icon-allow-overlap": true,
        },
    },
};
