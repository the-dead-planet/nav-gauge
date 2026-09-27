import { FontFamilyName, FontType, TextVariant, TypographyProps } from "./model";
import { SizeVariant } from "../model";

export const fontTypeToFamily: { [key in FontType]: FontFamilyName } = {
    [FontType.Default]: 'Space Grotesk',
    [FontType.Numeric]: 'Ubuntu Mono',
    [FontType.SpecialMessaging]: 'Syne Mono',
    [FontType.NeonHeader]: 'Sixtyfour',
    [FontType.NeonText]: 'Bitcount Single',
}

export const defaultTypographyProps: TypographyProps = {
    fontType: FontType.Default,
}

export const typographyVariantSpecifications: Record<TextVariant, {
    fontSize: number;
    fontWeight: '400' | '700';
    lineHeight: number;
}> = {
    header: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

export const controlTextSpecifications: Record<SizeVariant, { fontSize: number; lineHeight: number }> = {
    xs: { fontSize: 11, lineHeight: 12.1 },
    sm: { fontSize: 12, lineHeight: 13.2 },
    md: { fontSize: 14, lineHeight: 15.4 },
};

export const resolveTypographySpacing = ({
    m,
    mv,
    mh,
    mt,
    mr,
    mb,
    ml,
    p,
    pv,
    ph,
    pt,
    pr,
    pb,
    pl,
}: TypographyProps) => ({
    marginLeft: ml ?? mh ?? m,
    marginRight: mr ?? mh ?? m,
    marginTop: mt ?? mv ?? m,
    marginBottom: mb ?? mv ?? m,
    paddingLeft: pl ?? ph ?? p,
    paddingRight: pr ?? ph ?? p,
    paddingTop: pt ?? pv ?? p,
    paddingBottom: pb ?? pv ?? p,
});
