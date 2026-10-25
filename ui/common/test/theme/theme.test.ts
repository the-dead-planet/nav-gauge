import { expect } from "chai";
import { appearanceColorOptions, Orientation, surfaceVariantOptions, Theme, themeAppearanceStateOptions, themeSpecifications, ThemeName } from "../../src";

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 1280,
        windowHeight: 720,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};
const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);

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
    it('uses the base palette for omitted highlights across all variants, states and colors', () => {
        for (const specifications of Object.values(themeSpecifications)) {
            for (const specification of [specifications.light, specifications.dark]) {
                const theme = new Theme(specification, media);
                for (const variant of surfaceVariantOptions) {
                    for (const color of appearanceColorOptions) {
                        for (const state of themeAppearanceStateOptions) {
                            expect(theme.resolveAppearance(variant, color, undefined, state)).to.deep.equal(
                                theme.resolveAppearance(variant, color, color, state),
                            );
                        }
                    }
                }
                theme.destroy();
            }
        }
    });

    it("orders global layers semantically", () => {
        expect(Theme.layers['hud-connector'].zIndex).to.be.lessThan(Theme.layers.popup.zIndex);
        expect(Theme.layers.popup.zIndex).to.be.lessThan(Theme.layers.floating.zIndex);
        expect(Theme.layers.floating.zIndex).to.be.lessThan(Theme.layers.dialog.zIndex);
        expect(Theme.layers.dialog.zIndex).to.be.lessThan(Theme.layers.dropdown.zIndex);
        expect(Theme.layers.dropdown.zIndex).to.be.lessThan(Theme.layers['tooltip-connector'].zIndex);
        expect(Theme.layers['tooltip-connector'].zIndex).to.be.lessThan(Theme.layers.tooltip.zIndex);
    });

    it("resolves mode-aware directional elevation", () => {
        expect(theme.elevation("raised", "up")).to.deep.include({
            offset: { x: 0, y: -2 },
            depth: 4,
        });
        expect(theme.elevation("overlay").blur).to.be.greaterThan(
            theme.elevation("floating").blur,
        );
        expect(theme.elevation("none").opacity).to.equal(0);
        expect(Theme.layers.popup.elevation).to.equal("overlay");
        expect(theme.layer("popup")).to.deep.equal({
            zIndex: Theme.layers.popup.zIndex,
            elevation: theme.elevation("overlay"),
        });
    });

    it("resolves mode-aware surface colors", () => {
        const darkTheme = new Theme(themeSpecifications[ThemeName.Default].dark, media);
        const lightAppearance = theme.resolveAppearance();
        const darkAppearance = darkTheme.resolveAppearance();

        expect(lightAppearance).to.include({
            surface: theme.color('neutral', 100),
            glyphs: theme.color('neutral', 900),
        });
        expect(lightAppearance.border.color).to.equal(theme.color('neutral', 200));
        expect(darkAppearance).to.include({
            surface: darkTheme.color('neutral', 900),
            glyphs: darkTheme.color('neutral', 100),
        });
        expect(darkAppearance.border.color).to.equal(darkTheme.color('neutral', 800));
        darkTheme.destroy();
    });

    it("resolves default typography glyph states for every color in both modes", () => {
        const specifications = themeSpecifications[ThemeName.Default];
        for (const specification of [specifications.light, specifications.dark]) {
            const typographyTheme = new Theme(specification, media);
            for (const color of appearanceColorOptions) {
                expect(typographyTheme.resolveAppearance(undefined, color, 'hazard').glyphs).to.equal(
                    typographyTheme.color(color, typographyTheme.isDark ? 100 : 900),
                );
                expect(typographyTheme.resolveAppearance(undefined, color, 'hazard', 'hover-focus').glyphs).to.equal(
                    typographyTheme.color('hazard', typographyTheme.isDark ? 300 : 600),
                );
                expect(typographyTheme.resolveAppearance(undefined, color, 'hazard', 'active-pressed').glyphs).to.equal(
                    typographyTheme.color('hazard', typographyTheme.isDark ? 200 : 700),
                );
                expect(typographyTheme.resolveAppearance(undefined, color, 'hazard', 'disabled').glyphs).to.equal(
                    typographyTheme.color(color, typographyTheme.isDark ? 700 : 300),
                );
            }
            typographyTheme.destroy();
        }
    });

    it("resolves distinct ghost glyph states for every theme, mode, palette and status color", () => {
        for (const specifications of Object.values(themeSpecifications)) {
            for (const specification of [specifications.light, specifications.dark]) {
                const ghostTheme = new Theme(specification, media);
                for (const color of appearanceColorOptions) {
                    for (const highlightColor of appearanceColorOptions) {
                        const appearances = [
                            ghostTheme.resolveAppearance('ghost', color, highlightColor, 'default'),
                            ghostTheme.resolveAppearance('ghost', color, highlightColor, 'hover-focus'),
                            ghostTheme.resolveAppearance('ghost', color, highlightColor, 'active-pressed'),
                            ghostTheme.resolveAppearance('ghost', color, highlightColor, 'disabled'),
                        ];

                        expect(appearances.map(({ glyphs }) => glyphs)).to.deep.equal([
                            ghostTheme.color(color, ghostTheme.isLight ? 700 : 300),
                            ghostTheme.color(highlightColor, ghostTheme.isLight ? 800 : 200),
                            ghostTheme.color(highlightColor, ghostTheme.isLight ? 900 : 100),
                            ghostTheme.color(color, ghostTheme.isLight ? 300 : 700),
                        ]);
                        expect(themeAppearanceStateOptions.map((state) => (
                            ghostTheme.resolveAppearance('fill-translucent', color, highlightColor, state).glyphs
                        ))).to.deep.equal(appearances.map(({ glyphs }) => glyphs));
                        for (const appearance of appearances) {
                            expect(appearance.fontWeight).to.equal(500);
                            expect(appearance.surface).to.equal('transparent');
                            expect(appearance.border).to.deep.equal({
                                color: 'transparent',
                                width: 0,
                            });
                        }
                    }
                }
                ghostTheme.destroy();
            }
        }
    });

    it("aligns palette endpoints with neutral palette lightness", () => {
        const palettes = Object.values(Theme.palette);

        for (const palette of palettes) {
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

    it("softens the transition from shade 800 to 900", () => {
        const palette = Theme.palette.coral;

        expect(oklabLightness(palette[800]) - oklabLightness(palette[900])).to.be.lessThan(
            oklabLightness(palette[700]) - oklabLightness(palette[800])
        );
    });

    it("selects a readable palette endpoint for saturated fills", () => {
        expect(theme.contrastShade("yellow")).to.equal(900);
        expect(theme.contrastShade("navy")).to.equal(100);
        expect(theme.contrastShade("blue")).to.equal(100);
        expect(theme.contrastShade("purple")).to.equal(100);
        expect(theme.contrastShade("coral")).to.equal(100);
        expect(theme.contrastShade("peach")).to.equal(100);
        expect(theme.contrastShade("mint")).to.equal(100);
    });

    it("resolves variant appearance policy", () => {
        expect(theme.resolveAppearance("fill").fontWeight).to.equal(undefined);
        expect(theme.resolveAppearance("ghost", "primary", "secondary", "default").surface).to.equal("transparent");
        expect(theme.resolveAppearance("fill", "primary", "secondary", "default").border.width).to.equal(0);
        expect(theme.resolveAppearance("inset", "primary", "secondary", "default").border.width).to.equal(0);
        expect(theme.resolveAppearance("inset", "primary", "secondary", "hover-focus").border.width).to.equal(0);
        expect(theme.resolveAppearance("inset", "primary", "secondary", "active-pressed").border.width).to.equal(0);
        expect(theme.resolveAppearance("inset", "primary", "secondary", "default").effects.depth).to.equal("inset");
        expect(theme.resolveAppearance("fill-translucent", "primary", "secondary", "default").surface).to.match(/, 0\.24\)$/);
        expect(theme.resolveAppearance("ghost", "primary", "secondary", "active-pressed").effects.glowColor).to.equal(theme.color("secondary"));
        expect(theme.resolveAppearance("fill-inverse", "primary", "secondary", "hover-focus").surface).to.equal(
            theme.resolveAppearance("fill-inverse", "primary", "secondary", "default").surface,
        );
    });

    it("resolves status colors", () => {
        expect(theme.color("glitch")).to.equal(theme.color("red", 600));
        expect(theme.contrastShade("glitch")).to.equal(theme.contrastShade("red", 600));
        expect(theme.resolveAppearance("ghost", "glitch", "intel", "active-pressed").effects.glowColor).to.equal(
            theme.color("intel"),
        );
    });
});
