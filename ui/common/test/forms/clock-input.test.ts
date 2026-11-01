import { expect } from "chai";
import { describe, it } from "mocha";
import {
    clockValueFromAngle,
    getClockGeometry,
    radialLineCoords,
} from "../../src/forms/clock-input";
import { SizeVariant, sizeOptions, themeSizes } from "../../src/design-system";

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

describe("clockValueFromAngle", () => {
    it("snaps angles and clamps a slice at its nearest endpoint", () => {
        expect(clockValueFromAngle(0, 44, "angle", 0, 360, 6)).to.equal(42);
        expect(clockValueFromAngle(0, 100, "angle", 0, 85, 1)).to.equal(85);
        expect(clockValueFromAngle(0, 359, "angle", 0, 85, 1)).to.equal(0);
    });

    it("changes one duration hand, preserves elapsed hours, and respects the minimum", () => {
        const duration = (65 * 60 + 15) * 1000;
        expect(
            clockValueFromAngle(duration, 180, "seconds", 0, 360, 1000),
        ).to.equal((65 * 60 + 30) * 1000);
        expect(
            clockValueFromAngle(duration, 60, "minutes", 0, 360, 1000),
        ).to.equal((70 * 60 + 15) * 1000);
        expect(
            clockValueFromAngle(15000, 0, "seconds", 10000, 360, 1000),
        ).to.equal(10000);
    });
});

describe("getClockGeometry", () => {
    it("sizes every clock mode from shared control heights", () => {
        const expectedDiameters: Record<SizeVariant, number> = {
            xs: 36,
            sm: 48,
            md: 64,
            lg: 80,
        };
        for (const size of sizeOptions) {
            const controlHeight = themeSizes.control[size].height;
            const angle = getClockGeometry(controlHeight, "angle");
            expect(angle.svgSize).to.equal(expectedDiameters[size]);
            expect(getClockGeometry(controlHeight, "duration")).to.deep.equal(
                angle,
            );
            const slice = getClockGeometry(controlHeight, "slice");
            expect(slice.svgSize).to.equal(angle.svgSize);
            expect(slice.strokeWidth).to.equal(angle.strokeWidth);
        }
        expect(getClockGeometry(30, "angle").svgSize).to.equal(60);
    });
});
