import { FontType } from "@ui";

const mobileFontFamily: Record<FontType, string | undefined> = {
    [FontType.Default]: 'SpaceGrotesk-Regular',
    [FontType.Numeric]: 'UbuntuMono-Regular',
    [FontType.SpecialMessaging]: 'SyneMono-Regular',
    [FontType.NeonHeader]: 'Sixtyfour-Regular-VariableFont_BLED,SCAN',
    [FontType.NeonText]: 'BitcountSingle-Bold',
};

const mobileBoldFontFamily: Partial<Record<FontType, string>> = {
    [FontType.Default]: 'SpaceGrotesk-Bold',
    [FontType.Numeric]: 'UbuntuMono-Bold',
};

export const getMobileFontFamily = (fontType: FontType, bold = false): string | undefined => (
    bold ? mobileBoldFontFamily[fontType] ?? mobileFontFamily[fontType] : mobileFontFamily[fontType]
);
