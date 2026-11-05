import { expect } from "chai";
import { describe, it } from "mocha";
import {
    addDecimalStep,
    getCompanionNumberInputWidth,
} from "../../src/forms/number-input";

describe("addDecimalStep", () => {
    it("normalizes fractional steps", () => {
        expect(addDecimalStep(1.3, 0.1)).to.equal(1.4);
        expect(addDecimalStep(1.4, -0.1)).to.equal(1.3);
    });
});

describe("companion number input width", () => {
    it("uses one fixed horizontal width and fills vertical layouts", () => {
        expect(getCompanionNumberInputWidth()).to.equal(80);
        expect(getCompanionNumberInputWidth("start")).to.equal(80);
        expect(getCompanionNumberInputWidth("end")).to.equal(80);
        expect(getCompanionNumberInputWidth("above")).to.equal("100%");
        expect(getCompanionNumberInputWidth("below")).to.equal("100%");
    });
});
