import { expect } from "chai";
import { describe, it } from "mocha";
import { createExpression, validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import {
    DRAGGED_IMAGE_ID,
    imageLayerIds,
    imageSourceIds,
    MAP_IMAGE_MARKER_OFFSET_Y,
    MAP_IMAGE_ANCHOR_SIDE,
    MAP_IMAGE_ANCHOR_GAP,
    THUMBNAIL_IMAGE_SIZE,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import {
    getImagesLayers,
    getImageDragPreviewLayers,
} from "../src/images/images-layers";

describe("Image marker layers", () => {
    it('uses matching outline and anchor colors, with selected and dragged states above hover', () => {
        const layers = getImagesLayers(null, '#123456', '#345678', '#567890', '#ffffff');
        const outline = layers.find(({ id }) => id === imageLayerIds.thumbnailsOutline);
        const anchor = layers.find(({ id }) => id === imageLayerIds.anchors);
        const paint = outline?.type === 'circle' ? outline.paint?.['circle-stroke-color'] : undefined;
        expect(anchor?.type === 'symbol' && anchor.paint?.['icon-color']).to.deep.equal(paint);
        const parsed = createExpression(paint, 'circle-stroke-color');
        expect(parsed.result).to.equal('success');
        if (parsed.result !== 'success') {
            throw new Error('Invalid marker color expression');
        }
        const evaluate = (properties: Record<string, boolean>, state: Record<string, boolean>) =>
            parsed.value.evaluate({ zoom: 0 }, { type: 'Point', properties }, state);
        expect(evaluate({}, {})).to.equal('#123456');
        expect(evaluate({}, { highlight: true })).to.equal('#345678');
        expect(evaluate({ highlight: true }, {})).to.equal('#345678');
        expect(evaluate({ markerSelected: true }, { highlight: true })).to.equal('#567890');
        expect(evaluate({}, { highlight: true, dragging: true })).to.equal('#567890');
        expect(evaluate({ dragging: true }, {})).to.equal('#567890');
    });

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
                    ...getImagesLayers(null, "#123456", "#345678", "#567890", "#ffffff"),
                    ...getImageDragPreviewLayers("#123456"),
                ],
            }),
        ).to.deep.equal([]);
    });

    it("does not display the drag preview as a full-size playback image", () => {
        const layers = getImagesLayers(null, "#123456", "#345678", "#567890", "#ffffff");
        expect(
            layers.findIndex(({ id }) => id === imageLayerIds.countBadge),
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

    it('keeps anchors map-aligned and moves the photo, border, and badge together toward viewport top', () => {
        const layers = getImagesLayers(null, '#123456', '#345678', '#567890', '#ffffff');
        const anchor = layers.find(({ id }) => id === imageLayerIds.anchors);
        const image = layers.find(({ id }) => id === imageLayerIds.thumbnails);
        const outline = layers.find(({ id }) => id === imageLayerIds.thumbnailsOutline);
        const badge = layers.find(({ id }) => id === imageLayerIds.countBadge);
        expect(anchor?.type === 'symbol' && anchor.layout?.['icon-pitch-alignment']).to.equal('map');
        expect(anchor?.type === 'symbol' && anchor.layout?.['icon-rotation-alignment']).to.equal('map');
        expect(image?.type === 'symbol' && image.paint?.['icon-translate']).to.deep.equal([0, MAP_IMAGE_MARKER_OFFSET_Y]);
        expect(image?.type === 'symbol' && image.paint?.['icon-translate-anchor']).to.equal('viewport');
        expect(outline?.type === 'circle' && outline.paint?.['circle-translate']).to.deep.equal([0, MAP_IMAGE_MARKER_OFFSET_Y]);
        expect(badge?.type === 'symbol' && badge.layout?.['icon-offset']).to.deep.equal([20, MAP_IMAGE_MARKER_OFFSET_Y - 20]);
        expect(layers.some((layer) => layer.type === 'symbol' && layer.layout?.['text-field'])).to.equal(false);
        expect(-MAP_IMAGE_MARKER_OFFSET_Y - THUMBNAIL_IMAGE_SIZE / 2 - 2 - MAP_IMAGE_ANCHOR_SIDE).to.equal(MAP_IMAGE_ANCHOR_GAP);
    });
});
