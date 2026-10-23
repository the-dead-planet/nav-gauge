import { FontFamilyName, FontType, TextVariant, TypographyProps, TypographyStoryProps } from "./model";
import { SizeVariant } from "../model";
import { allColorShades } from '../theme/tinkers';
import { appearanceColorOptions } from '../tinkers';
import { StoryControls } from '../../storybook/model';

export const fontTypeToFamily: { [key in FontType]: FontFamilyName } = {
    [FontType.Default]: 'Space Grotesk',
    [FontType.Numeric]: 'Ubuntu Mono',
    [FontType.SpecialMessaging]: 'Syne Mono',
    [FontType.NeonHeader]: 'Sixtyfour',
    [FontType.NeonText]: 'Bitcount Single',
}

export const typographyVariants: TextVariant[] = ['header', 'body', 'caption'];

export const typographyStoryArgs: TypographyStoryProps = {
    children: 'The management of the dead planet wishes you a very fine day.',
    variant: 'body',
    color: 'neutral',
    fontType: FontType.Default,
    active: false,
    disabled: false,
    bold: false,
    uppercase: false,
    tabular: false,
    nowrap: false,
    shadow: false,
};

export const typographyStoryControls: StoryControls<TypographyStoryProps> = {
    children: {
        control: 'text',
    },
    variant: {
        control: 'select',
        options: typographyVariants,
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
    align: {
        control: 'select',
        options: ['Default', 'left', 'center', 'right'],
        mapping: {
            Default: undefined,
        },
    },
    active: {
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

export const typographyVariantSpecifications: Record<TextVariant, {
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
