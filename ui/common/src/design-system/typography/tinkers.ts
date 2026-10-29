import { FontFamilyName, FontType, FontWeight, NumericFontWeight, TextUsage, TypographyProps, TypographyStoryProps } from "./model";
import { SizeVariant } from "../model";
import { allColorShades } from '../tinkers';
import { appearanceColorOptions, DEFAULT_COLOR, surfaceVariantOptions } from '../tinkers';
import { StoryControls } from '../../storybook/model';

export const fontTypeToFamily: { [key in FontType]: FontFamilyName } = {
    [FontType.Default]: 'Space Grotesk',
    [FontType.Numeric]: 'Ubuntu Mono',
    [FontType.SpecialMessaging]: 'Syne Mono',
    [FontType.NeonHeader]: 'Sixtyfour',
    [FontType.NeonText]: 'Bitcount Single',
}

export const typographyUsages: TextUsage[] = ['header', 'body', 'caption'];

export const typographyFontWeights: NumericFontWeight[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const typographyStoryArgs: TypographyStoryProps = {
    children: 'The management of the dead planet wishes you a very fine day.',
    usage: 'body',
    color: DEFAULT_COLOR,
    fontType: FontType.Default,
    fontWeight: undefined,
    highlighted: false,
    disabled: false,
    bold: false,
    uppercase: false,
    tabular: false,
    nowrap: false,
    shadow: false,
};

export const typographyStoryControls: StoryControls<TypographyStoryProps> = {
    variant: {
        control: 'select',
        options: ['Default', ...surfaceVariantOptions],
        mapping: { Default: undefined },
    },
    themeMode: {
        control: 'select',
        options: [undefined, 'light', 'dark'],
    },
    children: {
        control: 'text',
    },
    usage: {
        control: 'select',
        options: typographyUsages,
    },
    color: {
        control: 'select',
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: 'select',
        options: ['Default', ...appearanceColorOptions],
        mapping: {
            Default: undefined,
        },
    },
    shade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    highlightShade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    fontType: {
        control: 'select',
        options: Object.values(FontType),
    },
    fontWeight: {
        control: 'select',
        options: ['Default', 'normal', 'bold', ...typographyFontWeights],
        mapping: {
            Default: undefined,
        },
    },
    align: {
        control: 'select',
        options: ['Default', 'left', 'center', 'right'],
        mapping: {
            Default: undefined,
        },
    },
    highlighted: {
        control: 'boolean',
    },
    disabled: {
        control: 'boolean',
    },
    bold: {
        control: 'boolean',
    },
    uppercase: {
        control: 'boolean',
    },
    tabular: {
        control: 'boolean',
    },
    nowrap: {
        control: 'boolean',
    },
    shadow: {
        control: 'boolean',
    },
};

export const typographyUsageSpecifications: Record<TextUsage, {
    fontSize: number;
    fontWeight: '400' | '700';
    lineHeight: number;
}> = {
    header: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
};

export const controlTextSpecifications: Record<SizeVariant, { fontSize: number; lineHeight: number }> = {
    xs: {
        fontSize: 11,
        lineHeight: 12.1,
    },
    sm: {
        fontSize: 12,
        lineHeight: 13.2,
    },
    md: {
        fontSize: 14,
        lineHeight: 15.4,
    },
    lg: {
        fontSize: 16,
        lineHeight: 17.6,
    },
};

export const resolveTypographyFontWeight = (
    fontWeight?: FontWeight,
    bold = false,
    fallback: FontWeight = typographyUsageSpecifications.body.fontWeight,
): NumericFontWeight => {
    const weight = fontWeight ?? (bold ? 'bold' : fallback);
    if (weight === 'normal') {
        return 400;
    }
    if (weight === 'bold') {
        return 700;
    }
    return Number(weight) as NumericFontWeight;
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
