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
} from "../tinkers/images";
import {
    ComparisonProperty,
    GetProperty,
    CaseFeatureStateOrPropertyCondition,
} from "./model";
import { BehaviorSubject } from "rxjs";
import type { RoutePlacement } from "../tinkers";
import type {
    ExpressionSpecification,
    FilterSpecification,
    SymbolLayerSpecification,
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
    thumbnailsStackBack: "route-story-thumbnails-stack-back",
    thumbnailsStackFront: "route-story-thumbnails-stack-front",
    thumbnailsOutline: "route-story-thumbnails-outline",
    thumbnails: "route-story-thumbnails",
    thumbnailsHighlightOutline: "route-story-thumbnails-highlight-outline",
    thumbnailsHighlight: "route-story-thumbnails-highlight",
    countBadge: "route-story-image-count-badge",
    countLabel: "route-story-image-count-label",
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
export const IMAGE_COUNT_BADGE_ID = "route-story-image-count-octagon";
const countOffset: [number, number] = [20, -20];
const countTextOffset: [number, number] = [20 / 11, -20 / 11];
const countText: ExpressionSpecification = [
    "case",
    [">", ["get", "markerCount"], 99],
    "99+",
    ["to-string", ["get", "markerCount"]],
];
export const expandedImageGroupId$ = new BehaviorSubject<number | null>(null);

export const toggleImageMarkerGroup = (imageIds: number[]) => {
    if (!imageIds.length) {
        return;
    }
    if (imageIds.some((id) => id === selectedImageId$.value)) {
        selectedImageId$.next(null);
        expandedImageGroupId$.next(null);
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
    highlightColor: string,
): CaseFeatureStateOrPropertyCondition => [
    "case",
    [
        "any",
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        ["==", ["get", FeatureStateProps.Highlight], true],
    ],
    highlightColor,
    "white",
];

const thumbnailsHighlightOutlineFilter: ComparisonProperty = [
    "==",
    ["get", "imageId"],
    DRAGGED_IMAGE_ID,
];
const thumbnailsHighlightFilter: ComparisonProperty = [
    "==",
    ["get", "imageId"],
    DRAGGED_IMAGE_ID,
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
        "icon-translate": [8, -8],
        "icon-translate-anchor": "viewport",
        "icon-opacity": 0.4,
    },
};
const thumbnailsStackFront: typeof thumbnailsStackBack = {
    ...thumbnailsStackBack,
    paint: {
        ...thumbnailsStackBack.paint,
        "icon-translate": [4, -4],
        "icon-opacity": 0.7,
    },
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
    thumbnailsOutline: {
        filter: thumbnailsFilter,
        getPaint: (highlightColor: string) => ({
            "circle-radius": Math.round(THUMBNAIL_IMAGE_SIZE / 2),
            "circle-color": "transparent",
            "circle-stroke-color": thumbnailsOutlineStrokeColor(highlightColor),
            "circle-stroke-width": thumbnailsOutlineStrokeWidth,
            "circle-stroke-opacity": thumbnailDraggingOpacity,
        }),
    },
    thumbnails: {
        filter: thumbnailsFilter,
        layout: {
            "icon-image": thumbnailIconImage,
            "icon-size": thumbnailIconSize,
            "icon-allow-overlap": true,
        },
        paint: {
            "icon-opacity": thumbnailDraggingOpacity,
        },
    },
    thumbnailsHighlightOutline: {
        filter: thumbnailsHighlightOutlineFilter,
        getPaint: (highlightColor: string) => ({
            "circle-radius": Math.round(THUMBNAIL_IMAGE_SIZE / 2) * 1.1,
            "circle-color": "transparent",
            "circle-stroke-color": highlightColor,
            "circle-stroke-width": 2,
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
            "icon-opacity": 1,
        },
    },
    countBadge: {
        filter: groupFilter,
        layout: {
            "icon-image": IMAGE_COUNT_BADGE_ID,
            "icon-size": 1,
            "icon-offset": countOffset,
            "icon-allow-overlap": true,
        },
        getPaint: (color: string) => ({ "icon-color": color }),
    },
    countLabel: {
        filter: groupFilter,
        layout: {
            "text-field": countText,
            "text-font": ["Noto Sans Regular"],
            "text-size": 11,
            "text-offset": countTextOffset,
            "text-allow-overlap": true,
        },
        getPaint: (color: string) => ({ "text-color": color }),
    },
    imageInDisplay: {
        getFilter: (displayImageId: number | null): ComparisonProperty => [
            "==",
            ["get", "imageId"],
            displayImageId ?? "",
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
