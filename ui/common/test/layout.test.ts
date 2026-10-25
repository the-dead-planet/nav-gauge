import { expect } from "chai";
import { Theme, resolveLayoutSpacing, layoutSpacingOptions } from "../src";

describe("Layout spacing", () => {
    it("uses the theme spacing scale without inventing a default gap", () => {
        expect(resolveLayoutSpacing()).to.equal(undefined);
        for (const spacing of layoutSpacingOptions) {
            expect(resolveLayoutSpacing(spacing)).to.equal(
                Number.parseFloat(Theme.spacing[spacing]),
            );
        }
    });
});
