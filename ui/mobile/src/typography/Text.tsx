import { FC } from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { defaultTypographyProps, FontType, TextVariant, TypographyProps, Theme, useTheme } from "@ui";

export type { TextVariant } from '@ui';

const variantStyles = StyleSheet.create({
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
});

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

const spacing = (value: TypographyProps['m']): number | undefined =>
    value ? Number.parseInt(Theme.spacing[value], 10) : undefined;

export interface TextProps extends Omit<RNTextProps, 'disabled'>, TypographyProps {
    variant?: TextVariant;
    /** Accepted for API compatibility with web. On mobile only `<Text>` is rendered. */
    as?: string;
}

export const Text: FC<TextProps> = ({
    variant = 'body',
    color,
    shade,
    align,
    nowrap,
    bold,
    disabled,
    uppercase,
    tabular,
    shadow,
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
    as: _as,
    fontType = defaultTypographyProps.fontType ?? FontType.Default,
    style,
    ...props
}) => {
    const theme = useTheme();
    const isBold = bold || variant === 'header';

    return (
        <RNText
            numberOfLines={nowrap ? 1 : undefined}
            style={[
                variantStyles[variant],
                {
                    fontFamily: isBold
                        ? mobileBoldFontFamily[fontType] ?? mobileFontFamily[fontType]
                        : mobileFontFamily[fontType],
                    color: color
                        ? theme.color(color, shade ?? (theme.isDark ? 100 : 900))
                        : theme.componentColor('text'),
                    fontWeight: isBold ? '700' : undefined,
                    fontVariant: tabular ? ['tabular-nums'] : undefined,
                    textAlign: align,
                    textTransform: uppercase ? 'uppercase' : undefined,
                    flexShrink: nowrap ? 1 : undefined,
                    marginTop: spacing(mt ?? mv ?? m),
                    marginRight: spacing(mr ?? mh ?? m),
                    marginBottom: spacing(mb ?? mv ?? m),
                    marginLeft: spacing(ml ?? mh ?? m),
                    paddingTop: spacing(pt ?? pv ?? p),
                    paddingRight: spacing(pr ?? ph ?? p),
                    paddingBottom: spacing(pb ?? pv ?? p),
                    paddingLeft: spacing(pl ?? ph ?? p),
                    textShadowColor: shadow
                        ? theme.color(color ?? 'neutral', color === 'neutral' ? 800 : 900, 0.5)
                        : undefined,
                    textShadowOffset: shadow ? { width: -1, height: 0 } : undefined,
                    textShadowRadius: shadow ? 1 : undefined,
                } satisfies TextStyle,
                style,
                disabled && { color: theme.color(color ?? 'neutral', theme.isDark ? 700 : 300) },
            ]}
            {...props}
        />
    );
};
