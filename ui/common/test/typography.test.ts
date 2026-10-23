import { expect } from 'chai';
import { resolveTypographyFontWeight, typographyFontWeights } from '../src';

describe('Typography weights', () => {
    it('normalizes cross-platform values and preserves explicit override precedence', () => {
        for (const fontWeight of typographyFontWeights) {
            expect(resolveTypographyFontWeight(fontWeight)).to.equal(fontWeight);
            expect(resolveTypographyFontWeight(`${fontWeight}`)).to.equal(fontWeight);
        }

        expect(resolveTypographyFontWeight('normal')).to.equal(400);
        expect(resolveTypographyFontWeight('bold')).to.equal(700);
        expect(resolveTypographyFontWeight()).to.equal(400);
        expect(resolveTypographyFontWeight(undefined, false, 500)).to.equal(500);
        expect(resolveTypographyFontWeight(undefined, true, 500)).to.equal(700);
        expect(resolveTypographyFontWeight(300, true, 500)).to.equal(300);
        expect(resolveTypographyFontWeight('normal', true, 700)).to.equal(400);
    });
});
