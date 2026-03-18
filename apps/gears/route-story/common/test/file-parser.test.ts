import { describe } from "mocha";
import { expect } from "chai";
import { getResizeDimensions } from "../src/file-parser";

describe("Route story gear", () => {
    describe("File parser", () => {
        it("should get resize dimensions", () => {
            const dimensions = getResizeDimensions({ width: 4096, height: 3072 }, 800);
            expect(dimensions.sourceX).to.be.equal(0);
            expect(dimensions.sourceY).to.be.equal(0);
            expect(dimensions.sourceWidth).to.be.equal(4096);
            expect(dimensions.sourceHeight).to.be.equal(3072);
            expect(dimensions.targetWidth).to.be.equal(800);
            expect(dimensions.targetHeight).to.be.equal(600);
        });

        it("should get resize dimensions keeping aspeect ratio", () => {
            const dimensions = getResizeDimensions({ width: 4096, height: 3072 }, 150, { keepAspectRatio: true });
            expect(dimensions.sourceX).to.be.equal(512);
            expect(dimensions.sourceY).to.be.equal(0);
            expect(dimensions.sourceWidth).to.be.equal(3072);
            expect(dimensions.sourceHeight).to.be.equal(3072);
            expect(dimensions.targetWidth).to.be.equal(150);
            expect(dimensions.targetHeight).to.be.equal(150);
        });
    });
});