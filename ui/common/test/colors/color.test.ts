import { expect } from "chai";
import { describe, it } from "mocha";
import { formatColor, hsvToRgb, rgbToHsv, tryParseColor } from "../../src/colors";

describe("HSV color conversion", () => {
    it("round trips RGB colors", () => {
        const color = { r: 51, g: 102, b: 153, a: 1 };
        expect(hsvToRgb(rgbToHsv(color))).to.deep.equal(color);
    });

    it("maps primary hues", () => {
        expect(hsvToRgb({ h: 120, s: 1, v: 1 })).to.deep.equal({ r: 0, g: 255, b: 0, a: 1 });
    });
});

describe("color text formats", () => {
    it("detects supported formats", () => {
        expect(tryParseColor('#369')?.format).to.equal('hex');
        expect(tryParseColor('rgb(51, 102, 153)')?.format).to.equal('rgb');
        expect(tryParseColor('rgba(51, 102, 153, .5)')?.format).to.equal('rgba');
        expect(tryParseColor('hsl(210, 50%, 40%)')?.format).to.equal('hsl');
        expect(tryParseColor('hsla(210, 50%, 40%, .5)')?.format).to.equal('hsla');
    });

    it("rejects invalid channels", () => {
        expect(tryParseColor('rgb(256, 0, 0)')).to.equal(null);
        expect(tryParseColor('hsl(0, 101%, 50%)')).to.equal(null);
    });

    it("formats colors in the selected format", () => {
        expect(formatColor({ r: 51, g: 102, b: 153, a: .5 }, 'hsla')).to.equal('hsla(210, 50%, 40%, 0.5)');
    });
});
