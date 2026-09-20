import { expect } from "chai";
import { describe, it } from "mocha";
import { radialLineCoords } from "../src/clock-input";

describe("radialLineCoords", () => {
    it("returns line endpoints for a clock angle", () => {
        expect(radialLineCoords(90, 10, 2, 5)).to.deep.equal({
            x1: 12,
            y1: 10,
            x2: 15,
            y2: 10,
        });
    });
});
