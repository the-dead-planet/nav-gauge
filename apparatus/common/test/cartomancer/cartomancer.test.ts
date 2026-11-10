import { expect } from "chai";
import { describe } from "mocha";
import { Cartomancer } from "../../src/index.js";

describe("Cartomancer", () => {
    describe("Buffer", () => {
        it("should get correct buffer in meters for a latitude and zoom", () => {
            expect(Cartomancer.getBufferInMeters(52, 13)).to.be.equal(47);
        });
        it("should get correct buffer in meters for a latitude and zoom with added offset", () => {
            expect(Cartomancer.getBufferInMeters(52, 18, 10)).to.be.equal(5);
        });
    });
});
