import { FeatureStateProps, LoadedImageData } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import {
    getIconImageId,
    getRouteLngLatAtDistanceFraction,
    RouteGeometryData,
    RoutePlacement,
} from "../tinkers";

export const IMAGE_ANIMATION_DURATION = 250;
export const IMAGE_PROPERTY = "iconImageId";
export const IMAGE_THUMBNAIL_PROPERTY = "iconImageThumbnailId";
export const DRAGGED_IMAGE_ID = -1;

export type ImageFeature = GeoJSON.Feature<
    GeoJSON.Point,
    ImageFeatureProperties
>;
export interface ImageFeatureProperties {
    imageId: number;
    distanceFromStartMeters: number;
    markerVisible?: boolean;
    markerCount?: number;
    markerGroupSize?: number;
    markerOpacity?: number;
    markerSelected?: boolean;
    markerAnchor?: boolean;
    [IMAGE_PROPERTY]: string;
    [IMAGE_THUMBNAIL_PROPERTY]: string;
    [FeatureStateProps.Highlight]?: boolean;
    [FeatureStateProps.Dragging]?: boolean;
}

export function getImageSource<TImageData>(
    loadedImages: LoadedImageData<TImageData>[],
    geojson?: GeoJson,
    routeGeometryData?: RouteGeometryData | null,
): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> {
    if (!geojson || !routeGeometryData) {
        return {
            type: "FeatureCollection",
            features: [],
        };
    }

    return {
        type: "FeatureCollection",
        features: loadedImages.map((image) => {
            const lngLat = getRouteLngLatAtDistanceFraction(
                geojson,
                routeGeometryData,
                image.distanceFraction,
            );

            return {
                type: "Feature",
                id: image.id,
                geometry: {
                    type: "Point",
                    coordinates: [lngLat.lng, lngLat.lat],
                },
                properties: {
                    imageId: image.id,
                    distanceFromStartMeters:
                        image.distanceFraction *
                        routeGeometryData.totalDistanceMeters,
                    markerVisible: true,
                    markerCount: 1,
                    markerOpacity: 1,
                    [IMAGE_PROPERTY]: getIconImageId(image),
                    [IMAGE_THUMBNAIL_PROPERTY]: getIconImageId(image, {
                        thumbnail: true,
                    }),
                },
            };
        }),
    };
}

export function getImageSourceWithMarkerVisibility(
    source: GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties>,
    visible: boolean,
): typeof source {
    return visible ? source : {
        ...source,
        features: source.features.map((feature) => ({ ...feature, properties: { ...feature.properties, markerVisible: false } })),
    };
}

export function getImageSourceWithDraggingState(
    source: GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties>,
    imageId: number | null,
): typeof source {
    if (imageId === null) {
        return source;
    }
    return {
        ...source,
        features: source.features.map((feature) =>
            feature.properties.imageId === imageId
                ? {
                      ...feature,
                      properties: {
                          ...feature.properties,
                          [FeatureStateProps.Dragging]: true,
                      },
                  }
                : feature,
        ),
    };
}

export const getImageMarkerFeatureId = (imageId: number | string): number => Math.abs(Number(imageId)) * 2 + 1;
export const getImageMarkerAnchorId = (imageId: number | string): number => getImageMarkerFeatureId(imageId) + 1;

export function getImageSourceWithAnchors(original: ReturnType<typeof getImageSource>, grouped: ReturnType<typeof getImageSource>): typeof grouped {
    const coordinates = new Map(original.features.map((feature) => [feature.properties.imageId, feature.geometry]));
    return {
        ...grouped,
        features: grouped.features.flatMap((feature) => [{ ...feature, id: getImageMarkerFeatureId(feature.properties.imageId) }, {
            ...feature,
            id: getImageMarkerAnchorId(feature.properties.imageId),
            geometry: coordinates.get(feature.properties.imageId) ?? feature.geometry,
            properties: {
                ...feature.properties,
                markerAnchor: true,
            },
        }]),
    };
}

export function getImageDragPreviewSource(
    source: GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties>,
    imageId: number | null,
    placement: RoutePlacement | null,
): typeof source {
    const image = source.features.find(
        (feature) => feature.properties.imageId === imageId,
    );
    if (!image || !placement) {
        return { type: "FeatureCollection", features: [] };
    }
    const preview: typeof source = {
        ...source,
        features: [
            {
                ...image,
                id: DRAGGED_IMAGE_ID,
                geometry: {
                    type: "Point",
                    coordinates: [placement.lngLat.lng, placement.lngLat.lat],
                },
                properties: {
                    ...image.properties,
                    imageId: DRAGGED_IMAGE_ID,
                    markerVisible: false,
                    markerSelected: true,
                    [FeatureStateProps.Highlight]: true,
                },
            },
        ],
    };
    return getImageSourceWithAnchors(preview, preview);
}
