import { expect } from "chai";
import { describe, it } from "mocha";
import {
    getSliderImageMarkers,
    groupImageMarkers,
} from "../src/tinkers/images";
import {
    getGroupedImageSource,
    getImageMarkerConnections,
} from "../src/layer-specification/grouped-image-source";
import {
    getImageDragPreviewSource,
    getImageSourceWithDraggingState,
    ImageFeature,
} from "../src/layer-specification/images-sources";
import {
    expandedImageGroupId$,
    selectedImageId$,
    toggleImageMarkerGroup,
    selectMapImageMarker,
} from "../src/layer-specification/images-layers";

describe("Image marker groups", () => {
    it("uses map groups as persistent pickers and slider groups as open/close toggles", () => {
        selectedImageId$.next(null);
        toggleImageMarkerGroup([1, 2]);
        expect(selectedImageId$.value).to.equal(1);
        toggleImageMarkerGroup([1, 2]);
        expect(selectedImageId$.value).to.equal(null);
        expect(expandedImageGroupId$.value).to.equal(null);
        selectMapImageMarker(2, 2);
        expect(selectedImageId$.value).to.equal(2);
        expect(expandedImageGroupId$.value).to.equal(2);
        selectMapImageMarker(2, 2);
        expect(selectedImageId$.value).to.equal(2);
        expect(expandedImageGroupId$.value).to.equal(2);
        toggleImageMarkerGroup([1, 2]);
        expect(selectedImageId$.value).to.equal(null);
        expect(expandedImageGroupId$.value).to.equal(null);
        selectMapImageMarker(3, 1);
        selectMapImageMarker(3, 1);
        expect(selectedImageId$.value).to.equal(null);
        selectedImageId$.next(null);
        expandedImageGroupId$.next(null);
    });
    it("groups by screen distance without chaining across the route", () => {
        const groups = groupImageMarkers(
            [
                { item: 1, x: 0, y: 0 },
                { item: 2, x: 9, y: 0 },
                { item: 3, x: 18, y: 0 },
                { item: 4, x: 0, y: 12 },
            ],
            10,
        );
        expect(
            groups.map((group) => group.map(({ item }) => item)),
        ).to.deep.equal([[1, 2], [3], [4]]);
    });

    it("regroups slider markers on resize and keeps the selected image available for dragging", () => {
        const images = [
            { id: 1, distanceFraction: 0.501 },
            { id: 2, distanceFraction: 0.51 },
            { id: 3 },
        ];
        const compact = getSliderImageMarkers(
            images,
            (fraction) => fraction * 100,
            1000,
            1000,
            2,
        );
        expect(compact).to.have.length(1);
        expect(compact[0]).to.deep.include({ image: images[1], percent: 51 });
        expect(compact[0].imageIds).to.deep.equal([1, 2]);
        expect(
            getSliderImageMarkers(
                images,
                (fraction) => fraction * 100,
                2000,
                1000,
                null,
            ),
        ).to.have.length(2);
    });

    it("does not count separate route passes together on a narrow slider", () => {
        const images = [0.004, 0, 0.005, 0.0051, 0.8].map(
            (distanceFraction, id) => ({ id, distanceFraction }),
        );
        const markers = getSliderImageMarkers(
            images,
            (fraction) => fraction * 100,
            10,
            10000,
            null,
        );
        expect(markers.map(({ imageIds }) => imageIds)).to.deep.equal([
            [0, 1, 2],
            [3],
            [4],
        ]);
    });

    it("preserves every playback feature, separates groups on zoom, and expands co-located images", async () => {
        const features: ImageFeature[] = [0, 0.1].map((longitude, index) => ({
            type: "Feature",
            id: index + 1,
            geometry: { type: "Point", coordinates: [longitude, 0] },
            properties: {
                imageId: index + 1,
                distanceFromStartMeters: index * 25,
                iconImageId: `image-${index + 1}`,
                iconImageThumbnailId: `image-${index + 1}-thumbnail`,
            },
        }));
        const source: GeoJSON.FeatureCollection<
            GeoJSON.Point,
            ImageFeature["properties"]
        > = { type: "FeatureCollection", features };
        const unproject = ([x, y]: [number, number]): [number, number] => [
            x / 100,
            y / 100,
        ];
        const grouped = await getGroupedImageSource(
            source,
            ([x, y]) => [x * 100, y * 100],
            unproject,
            null,
            null,
        );
        expect(grouped.features).to.have.length(2);
        expect(
            grouped.features.filter(
                ({ properties }) => properties.markerVisible,
            ),
        ).to.have.length(1);
        expect(grouped.features[0].properties.markerCount).to.equal(2);
        expect(grouped.features[1].geometry).to.deep.equal(
            features[1].geometry,
        );

        const zoomed = await getGroupedImageSource(
            source,
            ([x, y]) => [x * 1000, y * 1000],
            unproject,
            null,
            null,
        );
        expect(
            zoomed.features.every(({ properties }) => properties.markerVisible),
        ).to.equal(true);

        const expanded = await getGroupedImageSource(
            source,
            ([x, y]) => [x * 100, y * 100],
            unproject,
            2,
            1,
        );
        expect(
            expanded.features.every(
                ({ properties }) => properties.markerVisible,
            ),
        ).to.equal(true);
        expect(expanded.features[0].geometry.coordinates).not.to.deep.equal(
            expanded.features[1].geometry.coordinates,
        );
        expect(expanded.features[0].properties.markerOpacity).to.equal(0.45);
        expect(expanded.features[1].properties.markerSelected).to.equal(true);
        expect(source.features[0].geometry.coordinates).to.deep.equal([0, 0]);
        expect(
            getImageMarkerConnections(source, expanded).features,
        ).to.have.length(2);
        expect(
            getImageMarkerConnections(source, grouped).features,
        ).to.have.length(0);

        const dragging = getImageDragPreviewSource(grouped, 2, {
            lngLat: { lng: 1, lat: 1 },
            distanceFraction: 0.5,
        });
        expect(dragging.features).to.have.length(1);
        expect(dragging.features[0].geometry.coordinates).to.deep.equal([1, 1]);
        expect(
            getImageSourceWithDraggingState(grouped, 2).features,
        ).to.have.length(2);
        expect(grouped.features).to.have.length(2);
    });

    it("keeps separate route passes apart and limits each stack to a 50-metre route span at any zoom", async () => {
        const features: ImageFeature[] = [20, 0, 50, 51, 1000].map(
            (distanceFromStartMeters, imageId) => ({
                type: "Feature",
                id: imageId,
                geometry: { type: "Point", coordinates: [0, 0] },
                properties: {
                    imageId,
                    distanceFromStartMeters,
                    iconImageId: `image-${imageId}`,
                    iconImageThumbnailId: `image-${imageId}-thumbnail`,
                },
            }),
        );
        const source: GeoJSON.FeatureCollection<
            GeoJSON.Point,
            ImageFeature["properties"]
        > = {
            type: "FeatureCollection",
            features,
        };
        for (const scale of [1, 1000]) {
            const grouped = await getGroupedImageSource(
                source,
                ([x, y]) => [x * scale, y * scale],
                (point) => point,
                null,
                null,
            );
            const visible = grouped.features.filter(
                ({ properties }) => properties.markerVisible,
            );
            expect(
                visible.map(({ properties }) => [
                    properties.distanceFromStartMeters,
                    properties.markerCount,
                ]),
            ).to.deep.equal([
                [20, 3],
                [51, 1],
                [1000, 1],
            ]);
        }
    });
});
