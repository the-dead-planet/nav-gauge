import { expect } from "chai";
import { describe, it } from "mocha";
import { appearanceColorOptions } from "../../src/design-system/tinkers";
import {
    parseColor,
    toHexColor,
    withColorOpacity,
} from "../../src/design-system/colors";
import {
    Orientation,
    ThemeName,
    Theme,
    themeSpecifications,
} from "../../src/design-system";
import { getColorPickerSwatches } from "../../src/forms/color-picker/tinkers";

describe("color picker swatches", () => {
    it("covers every palette and status ramp while preserving opacity and canonical selection", () => {
        const media = {
            initial: () => ({
                orientation: Orientation.Landscape,
                windowWidth: 800,
                windowHeight: 600,
            }),
            subscribe: () => ({ unsubscribe: () => undefined }),
        };
        for (const mode of ["light", "dark"] as const) {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            try {
                for (const color of appearanceColorOptions) {
                    const current = withColorOpacity(
                        theme.color(color, 500),
                        0.5,
                    );
                    const swatches = getColorPickerSwatches(theme, current);
                    expect(swatches).to.have.length(
                        appearanceColorOptions.length * 3,
                    );
                    expect(
                        swatches.find(
                            (swatch) => swatch.label === `${color} 500`,
                        )?.selected,
                    ).to.equal(true);
                    for (const swatch of swatches) {
                        expect(parseColor(swatch.value).a).to.equal(0.5);
                    }
                    const hexSwatches = getColorPickerSwatches(
                        theme,
                        toHexColor(parseColor(current)),
                    );
                    expect(
                        hexSwatches.find(
                            (swatch) => swatch.label === `${color} 500`,
                        )?.selected,
                    ).to.equal(true);
                }
            } finally {
                theme.destroy();
            }
        }
    });
});
