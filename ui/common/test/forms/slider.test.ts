import { expect } from "chai";
import { getSliderRatio, snapSliderValue } from "../../src/forms/slider/tinkers";

describe("Slider values", () => {
    it("clamps progress, including empty and reversed ranges", () => {
        expect(getSliderRatio(15, 10, 20)).to.equal(0.5);
        expect(getSliderRatio(-1, 10, 20)).to.equal(0);
        expect(getSliderRatio(30, 10, 20)).to.equal(1);
        expect(getSliderRatio(10, 10, 10)).to.equal(0);
        expect(getSliderRatio(10, 20, 10)).to.equal(0);
    });

    it("snaps relative to the minimum without leaking decimal rounding errors", () => {
        expect(snapSliderValue(0.31, 0, 1, 0.1)).to.equal(0.3);
        expect(snapSliderValue(11.6, 10, 20, 3)).to.equal(13);
        expect(snapSliderValue(-20, 10, 20, 3)).to.equal(10);
        expect(snapSliderValue(30, 10, 20, 3)).to.equal(20);
        expect(snapSliderValue(0, 10, 10, 1)).to.equal(10);
        expect(snapSliderValue(12.2, 10, 20, 0)).to.equal(12);
    });
});
