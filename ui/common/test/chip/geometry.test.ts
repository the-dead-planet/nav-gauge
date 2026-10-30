import { expect } from "chai";
import { getChipBevelPath } from "../../src/gizmos/chip/geometry";

describe("Chip bevel geometry", () => {
    it("cuts all four corners and clamps the cut to the available inset area", () => {
        expect(getChipBevelPath("sm", 80, 24, 0.5)).to.equal(
            "M 4.5 0.5 H 75.5 L 79.5 4.5 V 19.5 L 75.5 23.5 H 4.5 L 0.5 19.5 V 4.5 Z",
        );
        expect(getChipBevelPath("sm", 6, 4, 0.5)).to.equal(
            "M 2 0.5 H 4 L 5.5 2 V 2 L 4 3.5 H 2 L 0.5 2 V 2 Z",
        );
    });
});
