import { FontFamilyName, FontType, TypographyProps } from "./model";

export const fontTypeToFamily: { [key in FontType]: FontFamilyName } = {
    [FontType.Default]: 'Space Grotesk',
    [FontType.Numeric]: 'Ubuntu Mono',
    [FontType.SpecialMessaging]: 'Syne Mono',
    [FontType.NeonHeader]: 'Sixtyfour',
    [FontType.NeonText]: 'Bitcount Single',
}

export const defaultTypographyProps: TypographyProps = {
    color: 'neutral',
    fontType: FontType.Default,
}
