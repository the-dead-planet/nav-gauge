import { expect } from "chai";
import {
    appearanceColorOptions,
    Orientation,
    resolveIconGlyphs,
    resolveIconState,
    Theme,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from "../src";

describe("Icon appearance", () => {
    it("resolves all palette and status states and shade overrides in both modes", () => {
        const modes: ThemeMode[] = ["light", "dark"];
        for (const mode of modes) {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                {
                    initial: () => ({
                        orientation: Orientation.Landscape,
                        windowWidth: 1280,
                        windowHeight: 720,
                    }),
                    subscribe: () => ({ unsubscribe: () => undefined }),
                },
            );
            for (const color of appearanceColorOptions) {
                expect(resolveIconGlyphs(theme, { color })).to.equal(
                    theme.color(color, mode === "light" ? 900 : 100),
                );
                expect(
                    resolveIconGlyphs(theme, {
                        color,
                        appearanceState: "hover-focus",
                    }),
                ).to.equal(theme.color(color, mode === "light" ? 600 : 300));
                expect(
                    resolveIconGlyphs(theme, {
                        color,
                        highlighted: true,
                        appearanceState: "hover-focus",
                    }),
                ).to.equal(theme.color(color, mode === "light" ? 700 : 200));
                expect(
                    resolveIconGlyphs(theme, {
                        color: "primary",
                        highlightColor: color,
                        highlighted: true,
                        highlightGlyphsShade: 50,
                    }),
                ).to.equal(theme.color(color, 50));
                expect(
                    resolveIconGlyphs(theme, { color, glyphsShade: 400 }),
                ).to.equal(theme.color(color, 400));
                expect(
                    resolveIconGlyphs(theme, {
                        color,
                        highlightColor: "hazard",
                        disabled: true,
                        highlighted: true,
                        appearanceState: "hover-focus",
                        glyphsShade: 50,
                        highlightGlyphsShade: 50,
                    }),
                ).to.equal(theme.color(color, mode === "light" ? 300 : 700));
            }
            expect(resolveIconGlyphs(theme, { color: "#123456" })).to.equal(
                "#123456",
            );
            expect(
                resolveIconGlyphs(theme, { color: "#123456", disabled: true }),
            ).to.equal(theme.color("neutral", mode === "light" ? 300 : 700));
            theme.destroy();
        }
        expect(
            resolveIconState({
                highlighted: true,
                appearanceState: "disabled",
            }),
        ).to.equal("disabled");
        expect(
            resolveIconState({
                highlighted: true,
                appearanceState: "hover-focus",
            }),
        ).to.equal("active-pressed");
    });
});
