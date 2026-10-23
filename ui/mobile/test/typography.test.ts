import { expect } from 'chai';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { FontType, typographyFontWeights } from '@ui';
import { getMobileFontFamily } from '../src/design-system/typography/fontFamily';

describe('Mobile typography fonts', () => {
    it('selects weight-specific faces and references bundled font assets', () => {
        expect(getMobileFontFamily(FontType.Default, 500)).to.equal('SpaceGrotesk-Medium');
        expect(getMobileFontFamily(FontType.Default, 600)).to.equal('SpaceGrotesk-SemiBold');
        expect(getMobileFontFamily(FontType.NeonText, 800)).to.equal('BitcountSingle-ExtraBold');

        for (const fontType of Object.values(FontType)) {
            for (const fontWeight of typographyFontWeights) {
                const fontFamily = getMobileFontFamily(fontType, fontWeight);
                const fontPath = resolve(__dirname, '../../../app-mobile/android/app/src/main/assets/fonts', `${fontFamily}.ttf`);
                expect(existsSync(fontPath), fontPath).to.equal(true);
            }
        }
    });
});
