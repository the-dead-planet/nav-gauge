import { FontType, NumericFontWeight } from "@ui";

const mobileFontFamily: Record<FontType, string | undefined> = {
    [FontType.Default]: 'SpaceGrotesk-Regular',
    [FontType.Numeric]: 'UbuntuMono-Regular',
    [FontType.SpecialMessaging]: 'SyneMono-Regular',
    [FontType.NeonHeader]: 'Sixtyfour-Regular-VariableFont_BLED,SCAN',
    [FontType.NeonText]: 'BitcountSingle-Regular',
};

const mobileWeightedFontFamily: Partial<Record<FontType, Record<NumericFontWeight, string>>> = {
    [FontType.Default]: {
        100: 'SpaceGrotesk-Light',
        200: 'SpaceGrotesk-Light',
        300: 'SpaceGrotesk-Light',
        400: 'SpaceGrotesk-Regular',
        500: 'SpaceGrotesk-Medium',
        600: 'SpaceGrotesk-SemiBold',
        700: 'SpaceGrotesk-Bold',
        800: 'SpaceGrotesk-Bold',
        900: 'SpaceGrotesk-Bold',
    },
    [FontType.Numeric]: {
        100: 'UbuntuMono-Regular',
        200: 'UbuntuMono-Regular',
        300: 'UbuntuMono-Regular',
        400: 'UbuntuMono-Regular',
        500: 'UbuntuMono-Regular',
        600: 'UbuntuMono-Bold',
        700: 'UbuntuMono-Bold',
        800: 'UbuntuMono-Bold',
        900: 'UbuntuMono-Bold',
    },
    [FontType.NeonText]: {
        100: 'BitcountSingle-Thin',
        200: 'BitcountSingle-ExtraLight',
        300: 'BitcountSingle-Light',
        400: 'BitcountSingle-Regular',
        500: 'BitcountSingle-Medium',
        600: 'BitcountSingle-SemiBold',
        700: 'BitcountSingle-Bold',
        800: 'BitcountSingle-ExtraBold',
        900: 'BitcountSingle-Black',
    },
};

export const getMobileFontFamily = (fontType: FontType, fontWeight: NumericFontWeight = 400): string | undefined => (
    mobileWeightedFontFamily[fontType]?.[fontWeight] ?? mobileFontFamily[fontType]
);
