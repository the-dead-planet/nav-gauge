import { expect } from "chai";
import { getOctagonalGeometry } from "../../src/hud/octagonal-panel/geometry";

describe("Octagonal geometry", () => {
    it("cuts all four corners and clamps the cut to the available inset area", () => {
        expect(getOctagonalGeometry(80, 24, "sm", 0.5).points).to.equal(
            "4.5,0.5 75.5,0.5 79.5,4.5 79.5,19.5 75.5,23.5 4.5,23.5 0.5,19.5 0.5,4.5",
        );
        expect(getOctagonalGeometry(6, 4, "sm", 0.5).points).to.equal(
            "2,0.5 4,0.5 5.5,2 5.5,2 4,3.5 2,3.5 0.5,2 0.5,2",
        );
    });

    it("shades both left diagonals dark and both right diagonals light", () => {
        const geometry = getOctagonalGeometry(80, 24, "sm");
        expect(geometry.shadowPoints).to.equal("4,24 0,20 0,4 4,0 76,0");
        expect(geometry.highlightPoints).to.equal("76,0 80,4 80,20 76,24 4,24");
    });

    it("keeps all eight regular octagon edges equal at every size and stroke inset", () => {
        for (const [width, height] of [
            [18, 18],
            [24, 24],
            [32, 32],
            [40, 40],
            [200, 80],
        ]) {
            for (const inset of [0, 0.5, 2]) {
                const vertices = getOctagonalGeometry(
                    width,
                    height,
                    "sm",
                    inset,
                    true,
                )
                    .points.split(" ")
                    .map((point) => point.split(",").map(Number));
                expect(vertices).to.have.length(8);
                const edgeLengths = vertices.map(
                    ([horizontal, vertical], index) => {
                        const next = vertices[(index + 1) % vertices.length];
                        expect(horizontal).to.be.within(inset, width - inset);
                        expect(vertical).to.be.within(inset, height - inset);
                        return Math.hypot(
                            next[0] - horizontal,
                            next[1] - vertical,
                        );
                    },
                );
                for (const length of edgeLengths) {
                    expect(length).to.be.greaterThan(0);
                    expect(length).to.be.closeTo(edgeLengths[0], 1e-8);
                }
            }
        }
    });
});
