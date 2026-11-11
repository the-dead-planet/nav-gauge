import { FeatureStateProps } from "@apparatus";
import {
    groupImageMarkers,
    MAP_IMAGE_GROUP_RADIUS,
    canGroupImageRouteDistances,
} from "../tinkers/images";
import { ImageFeature, ImageFeatureProperties } from "./images-sources";

type Coordinate = [number, number];
type ImageSource = GeoJSON.FeatureCollection<
    GeoJSON.Point,
    ImageFeatureProperties
>;

export async function getGroupedImageSource(
    source: ImageSource,
    project: (coordinate: Coordinate) => Coordinate | Promise<Coordinate>,
    unproject: (point: Coordinate) => Coordinate | Promise<Coordinate>,
    selectedImageId: number | null,
    expandedImageGroupId: number | null,
): Promise<ImageSource> {
    const positions = await Promise.all(
        source.features.map(async (feature) => {
            const [x, y] = await project([
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
            ]);
            return { item: feature, x, y };
        }),
    );
    const features: ImageFeature[] = [];
    const groups = groupImageMarkers(
        positions,
        MAP_IMAGE_GROUP_RADIUS,
        (candidate, member) =>
            canGroupImageRouteDistances(
                candidate.properties.distanceFromStartMeters,
                member.properties.distanceFromStartMeters,
            ),
    );
    for (const group of groups) {
        const expanded = group.some(
            ({ item }) => item.properties.imageId === expandedImageGroupId,
        );
        const lead =
            group.find(
                ({ item }) => item.properties.imageId === selectedImageId,
            ) ?? group[0];
        const expandedCoordinates =
            expanded && group.length > 1
                ? await Promise.all(
                      group.map((_position, index) =>
                          unproject([
                              group[0].x +
                                  (index - (group.length - 1) / 2) *
                                      (MAP_IMAGE_GROUP_RADIUS + 8),
                              group[0].y - MAP_IMAGE_GROUP_RADIUS,
                          ]),
                      ),
                  )
                : [];
        for (const [index, position] of group.entries()) {
            const feature = position.item;
            const selected = feature.properties.imageId === selectedImageId;
            const coordinates =
                expandedCoordinates[index] ?? feature.geometry.coordinates;
            features.push({
                ...feature,
                geometry: { type: "Point", coordinates },
                properties: {
                    ...feature.properties,
                    markerVisible: expanded || position === lead,
                    markerCount:
                        expanded || position !== lead ? 1 : group.length,
                    markerOpacity:
                        selectedImageId === null || selected ? 1 : 0.45,
                    markerSelected: selected,
                    [FeatureStateProps.Highlight]: selected,
                },
            });
        }
    }
    return { type: "FeatureCollection", features };
}

export function getImageMarkerConnections(
    original: ImageSource,
    grouped: ImageSource,
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
    const originals = new Map(
        original.features.map((feature) => [
            feature.properties.imageId,
            feature,
        ]),
    );
    return {
        type: "FeatureCollection",
        features: grouped.features.flatMap(
            (feature): GeoJSON.Feature<GeoJSON.LineString>[] => {
                const anchor = originals.get(feature.properties.imageId)
                    ?.geometry.coordinates;
                const coordinates = feature.geometry.coordinates;
                if (
                    !feature.properties.markerVisible ||
                    !anchor ||
                    (anchor[0] === coordinates[0] &&
                        anchor[1] === coordinates[1])
                ) {
                    return [];
                }
                return [
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: [anchor, coordinates],
                        },
                    },
                ];
            },
        ),
    };
}
