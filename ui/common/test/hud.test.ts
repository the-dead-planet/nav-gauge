import { expect } from "chai";
import {
    getBevelPanelGeometry,
    getHudAnchorPoint,
    getHudConnectorGeometry,
    getNotchedPanelGeometry,
    hudConnectorAnchors,
    sizeOptions,
} from "../src";

describe("HUD geometry", () => {
    it("anchors every connector point relative to its wrapper", () => {
        const rectangle = { x: 50, y: 100, width: 80, height: 40 };
        const wrapper = { x: 20, y: 60, width: 200, height: 200 };
        expect(
            hudConnectorAnchors.map((anchor) =>
                getHudAnchorPoint(rectangle, anchor, wrapper),
            ),
        ).to.deep.equal([
            { x: 30, y: 40 },
            { x: 70, y: 40 },
            { x: 110, y: 40 },
            { x: 110, y: 60 },
            { x: 110, y: 80 },
            { x: 70, y: 80 },
            { x: 30, y: 80 },
            { x: 30, y: 60 },
            { x: 70, y: 60 },
        ]);
        const geometry = getHudConnectorGeometry([
            { x: 30, y: 40 },
            { x: 110, y: 80 },
        ]);
        expect(geometry.path.split(" ")[0]).to.equal("30,40");
        expect(geometry.path.split(" ")[3]).to.equal("110,80");
        expect(geometry.marker.split(" ")).to.have.length(6);
    });

    it("clamps bevel depth on narrow panels without negative coordinates", () => {
        for (const size of sizeOptions) {
            for (const width of [1, 8, 40, 200]) {
                const geometry = getBevelPanelGeometry(width, 40, size);
                const points = geometry.points
                    .split(" ")
                    .map((point) => point.split(",").map(Number));
                expect(points).to.have.length(6);
                for (const [x, y] of points) {
                    expect(x).to.be.within(0, width);
                    expect(y).to.be.within(0, 40);
                }
            }
        }
        const geometry = getNotchedPanelGeometry(200, 100, 38);
        expect(geometry.bodyPoints.split(" ")).to.have.length(11);
        expect(geometry.headerPoints).not.to.include("NaN");
    });
});
