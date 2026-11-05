import { expect } from "chai";
import { describe, it } from "mocha";
import { snapRotation } from "../../src/forms/icon-rotate-input/tinkers";

describe("snapRotation", () => {
    it("wraps full turns relative to the configured minimum and clamps partial turns", () => {
        expect(snapRotation(361, 0, 360, 5)).to.equal(0);
        expect(snapRotation(-6, 0, 360, 5)).to.equal(355);
        expect(snapRotation(190, -180, 180, 5)).to.equal(-170);
        expect(snapRotation(66, 20, 100, 10)).to.equal(70);
        expect(snapRotation(-20, 20, 100, 10)).to.equal(20);
        expect(snapRotation(140, 20, 100, 10)).to.equal(100);
    });
});
