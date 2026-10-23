import { expect } from 'chai';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { FontType, resolveTypographyFontWeight, typographyFontWeights } from '@ui';
import { resolveMobileFont } from '../src/design-system/typography/tinkers';

describe('Mobile typography fonts', () => {
    it('selects weight-specific faces and references bundled font assets', () => {
        expect(resolveMobileFont(FontType.Default, 500)).to.deep.equal({
            fontFamily: 'SpaceGrotesk-Medium',
            fontWeight: 500,
        });
        expect(resolveMobileFont(FontType.Default, 600)).to.deep.equal({
            fontFamily: 'SpaceGrotesk-SemiBold',
            fontWeight: 600,
        });
        expect(resolveMobileFont(FontType.NeonText, 800)).to.deep.equal({
            fontFamily: 'BitcountSingle-ExtraBold',
            fontWeight: 800,
        });

        for (const fontType of Object.values(FontType)) {
            for (const fontWeight of typographyFontWeights) {
                const { fontFamily } = resolveMobileFont(fontType, fontWeight);
                const fontPath = resolve(__dirname, '../../../app-mobile/android/app/src/main/assets/fonts', `${fontFamily}.ttf`);
                expect(existsSync(fontPath), fontPath).to.equal(true);
            }
        }
    });

    it('uses the nearest supported face, including the thinnest and boldest available', () => {
        for (const fontType of [FontType.SpecialMessaging, FontType.NeonHeader]) {
            for (const fontWeight of typographyFontWeights) {
                const font = resolveMobileFont(fontType, fontWeight);
                expect(font).to.deep.equal(resolveMobileFont(fontType));
                expect(font.fontWeight).to.equal(400);
            }
        }
        expect(resolveMobileFont(FontType.Default, 100)).to.deep.equal(resolveMobileFont(FontType.Default, 300));
        expect(resolveMobileFont(FontType.Default, 200)).to.deep.equal(resolveMobileFont(FontType.Default, 300));
        expect(resolveMobileFont(FontType.Default, 800)).to.deep.equal(resolveMobileFont(FontType.Default, 700));
        expect(resolveMobileFont(FontType.Default, 900)).to.deep.equal(resolveMobileFont(FontType.Default, 700));
        expect(resolveMobileFont(FontType.Numeric, 500)).to.deep.equal(resolveMobileFont(FontType.Numeric));
        expect(resolveMobileFont(FontType.Numeric, 600)).to.deep.equal(resolveMobileFont(FontType.Numeric, 700));
    });

    it('loads Android weight-specific assets without requesting a second bold suffix', () => {
        expect(resolveMobileFont(FontType.Default, resolveTypographyFontWeight('bold'), 'android')).to.deep.equal({
            fontFamily: 'SpaceGrotesk-Bold',
            fontWeight: 400,
        });
        expect(resolveMobileFont(FontType.Default, 700, 'ios').fontWeight).to.equal(700);

        for (const fontType of Object.values(FontType)) {
            for (const fontWeight of typographyFontWeights) {
                const font = resolveMobileFont(fontType, fontWeight, 'android');
                const suffix = font.fontWeight >= 700 ? '_bold' : '';
                const fontPath = resolve(__dirname, '../../../app-mobile/android/app/src/main/assets/fonts', `${font.fontFamily}${suffix}.ttf`);
                expect(existsSync(fontPath), fontPath).to.equal(true);
            }
        }
    });
});
