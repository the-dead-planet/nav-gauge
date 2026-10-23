import { FontType, NumericFontWeight, typographyFontWeights } from "@ui";
import type { PlatformOSType } from 'react-native';

// Every bundled font family has a regular face.
const defaultMobileFontWeight: NumericFontWeight = 400;

const mobileFontFamily: Record<FontType, string> = {
    [FontType.Default]: 'SpaceGrotesk-Regular',
    [FontType.Numeric]: 'UbuntuMono-Regular',
    [FontType.SpecialMessaging]: 'SyneMono-Regular',
    [FontType.NeonHeader]: 'Sixtyfour-Regular-VariableFont_BLED,SCAN',
    [FontType.NeonText]: 'BitcountSingle-Regular',
};

const mobileWeightedFontFamily: Partial<Record<FontType, Partial<Record<NumericFontWeight, string>>>> = {
    [FontType.Default]: {
        300: 'SpaceGrotesk-Light',
        400: 'SpaceGrotesk-Regular',
        500: 'SpaceGrotesk-Medium',
        600: 'SpaceGrotesk-SemiBold',
        700: 'SpaceGrotesk-Bold',
    },
    [FontType.Numeric]: {
        400: 'UbuntuMono-Regular',
        700: 'UbuntuMono-Bold',
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

export const resolveMobileFont = (
    fontType: FontType,
    fontWeight: NumericFontWeight = defaultMobileFontWeight,
    platform?: PlatformOSType,
) => {
    const families = mobileWeightedFontFamily[fontType];
    const closestWeight = typographyFontWeights.reduce((closest, candidate) => {
        if (families?.[candidate] !== undefined
            && Math.abs(candidate - fontWeight) < Math.abs(closest - fontWeight)) {
            return candidate;
        }
        return closest;
    }, defaultMobileFontWeight);

    return {
        fontFamily: families?.[closestWeight] ?? mobileFontFamily[fontType],
        // Android appends `_bold` for bold styles; the selected asset already carries its weight.
        fontWeight: platform === 'android' ? defaultMobileFontWeight : closestWeight,
    };
};
