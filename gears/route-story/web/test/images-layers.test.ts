import { expect } from "chai";
import { describe, it } from "mocha";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import {
    DRAGGED_IMAGE_ID,
    imageLayerIds,
    imageSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getImagesLayers } from "../src/images/images-layers";

describe("Image marker layers", () => {
    it("accepts grouped marker styling without requiring a glyph service", () => {
        expect(
            validateStyleMin({
                version: 8,
                sources: {
                    [imageSourceIds.thumbnails]: {
                        type: "geojson",
                        data: { type: "FeatureCollection", features: [] },
                    },
                },
                layers: getImagesLayers(null, "#123456"),
            }),
        ).to.deep.equal([]);
    });

    it("does not display the drag preview as a full-size playback image", () => {
        const layer = getImagesLayers(null, "#123456").find(
            ({ id }) => id === imageLayerIds.imageInDisplay,
        );
        expect(
            layer && "filter" in layer ? layer.filter : undefined,
        ).not.to.deep.equal(["==", ["get", "imageId"], DRAGGED_IMAGE_ID]);
    });
});
