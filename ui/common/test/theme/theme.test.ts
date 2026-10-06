import { expect } from "chai";
import { Theme } from "../../src";

const oklabLightness = ({ r, g, b }: { r: number; g: number; b: number }): number => {
    const linearChannels = [r, g, b].map((channel) => {
        const normalizedChannel = channel / 255;
        return normalizedChannel <= 0.04045
            ? normalizedChannel / 12.92
            : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
    });
    const long = Math.cbrt(0.4122214708 * linearChannels[0] + 0.5363325363 * linearChannels[1] + 0.0514459929 * linearChannels[2]);
    const medium = Math.cbrt(0.2119034982 * linearChannels[0] + 0.6806995451 * linearChannels[1] + 0.1073969566 * linearChannels[2]);
    const short = Math.cbrt(0.0883024619 * linearChannels[0] + 0.2817188376 * linearChannels[1] + 0.6299787005 * linearChannels[2]);
    return 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
};

describe("Theme", () => {
    it("orders global layers semantically", () => {
        expect(Theme.zIndex.hudConnector).to.be.lessThan(Theme.zIndex.popup);
        expect(Theme.zIndex.popup).to.be.lessThan(Theme.zIndex.floating);
        expect(Theme.zIndex.floating).to.be.lessThan(Theme.zIndex.dialog);
        expect(Theme.zIndex.dialog).to.be.lessThan(Theme.zIndex.dropdown);
        expect(Theme.zIndex.dropdown).to.be.lessThan(Theme.zIndex.tooltipConnector);
        expect(Theme.zIndex.tooltipConnector).to.be.lessThan(Theme.zIndex.tooltip);
    });

    it("aligns chromatic palette endpoints with grey palette lightness", () => {
        const chromaticPalettes = Object.entries(Theme.palette)
            .filter(([name]) => !name.startsWith("grey"))
            .map(([, palette]) => palette);

        for (const palette of chromaticPalettes) {
            expect(oklabLightness(palette[50])).to.be.closeTo(0.964214, 0.003);
            expect(oklabLightness(palette[100])).to.be.closeTo(0.907304, 0.003);
            expect(oklabLightness(palette[900])).to.be.closeTo(0.238684, 0.003);

            const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
            for (let index = 1; index < shades.length; index += 1) {
                expect(oklabLightness(palette[shades[index]])).to.be.lessThan(
                    oklabLightness(palette[shades[index - 1]])
                );
            }
        }
    });

    it("fades very light shades toward white", () => {
        const palette = Theme.palette["luminous-yellow"];
        const channelSpread = ({ r, g, b }: { r: number; g: number; b: number }): number =>
            Math.max(r, g, b) - Math.min(r, g, b);

        expect(channelSpread(palette[50])).to.be.lessThan(25);
        expect(channelSpread(palette[100])).to.be.greaterThan(channelSpread(palette[50]));
    });
});
