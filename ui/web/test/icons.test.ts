import { expect } from "chai";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { appearanceColorOptions } from "@ui";

const require = createRequire(__filename);
const previousCssLoader = require.extensions[".css"];
require.extensions[".css"] = (module) => {
    module.exports = {
        __esModule: true,
        default: new Proxy(
            {},
            {
                get: (_target, name) => name,
            },
        ),
    };
};
const { Icon } =
    require("../src/design-system/icons/Icon") as typeof import("../src/design-system/icons/Icon");
if (previousCssLoader) {
    require.extensions[".css"] = previousCssLoader;
} else {
    delete require.extensions[".css"];
}

describe("Icon renderer", () => {
    it("inherits owner state without creating a second appearance scope", () => {
        const markup = renderToStaticMarkup(
            createElement(Icon, { src: "gear.svg" }),
        );
        expect(markup).to.include('aria-hidden="true"');
        expect(markup).not.to.include("data-appearance-variant");
        expect(markup).not.to.include('role="img"');
    });

    it("scopes all theme colors, arbitrary shades, and disabled priority to shared appearance", () => {
        for (const color of appearanceColorOptions) {
            const markup = renderToStaticMarkup(
                createElement(Icon, {
                    src: "gear.svg",
                    color,
                    highlightColor: "intel",
                    glyphsShade: 50,
                    highlightGlyphsShade: 400,
                    disabled: true,
                    highlighted: true,
                    appearanceState: "hover-focus",
                    ariaHidden: false,
                    "aria-label": "Gear",
                    width: "10",
                    height: "100%",
                    strokeWidth: 0,
                }),
            );
            expect(markup).to.include(`data-appearance-color="${color}"`);
            expect(markup).to.include('data-appearance-state="disabled"');
            expect(markup).to.include(
                `--appearance-default-glyphs-override:var(--color-${color}-50)`,
            );
            expect(markup).to.include(
                "--appearance-active-pressed-glyphs-override:var(--color-intel-400)",
            );
            expect(markup).to.include("--icon-width:10px");
            expect(markup).to.include("--icon-height:100%");
            expect(markup).to.include("--icon-stroke-width:0");
            expect(markup).to.include('role="img"');
            expect(markup).to.include('aria-label="Gear"');
        }
    });
});
