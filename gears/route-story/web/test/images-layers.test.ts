import { expect } from "chai";
import { describe, it } from "mocha";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import {
    DRAGGED_IMAGE_ID,
    imageLayerIds,
    imageSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import {
    getImagesLayers,
    getImageDragPreviewLayers,
} from "../src/images/images-layers";

describe("Image marker layers", () => {
    it("accepts canvas badge and separate drag-preview layers", () => {
        expect(
            validateStyleMin({
                version: 8,
                glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
                sources: {
                    [imageSourceIds.thumbnails]: {
                        type: "geojson",
                        data: { type: "FeatureCollection", features: [] },
                    },
                    [imageSourceIds.dragPreview]: {
                        type: "geojson",
                        data: { type: "FeatureCollection", features: [] },
                    },
                },
                layers: [
                    ...getImagesLayers(null, "#123456", "#ffffff"),
                    ...getImageDragPreviewLayers("#123456"),
                ],
            }),
        ).to.deep.equal([]);
    });

    it("does not display the drag preview as a full-size playback image", () => {
        const layers = getImagesLayers(null, "#123456", "#ffffff");
        expect(
            layers.findIndex(({ id }) => id === imageLayerIds.countLabel),
        ).to.be.lessThan(
            layers.findIndex(({ id }) => id === imageLayerIds.imageInDisplay),
        );
        const layer = layers.find(
            ({ id }) => id === imageLayerIds.imageInDisplay,
        );
        expect(
            layer && "filter" in layer ? layer.filter : undefined,
        ).not.to.deep.equal(["==", ["get", "imageId"], DRAGGED_IMAGE_ID]);
    });
});
