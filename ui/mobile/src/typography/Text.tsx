import { FC } from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { defaultTypographyProps, FontType, resolveTypographySpacing, TextVariant, typographyVariantSpecifications, TypographyProps, Theme, useTheme } from "@ui";
import { getMobileFontFamily } from "./fontFamily";

export type { TextVariant } from '@ui';

const variantStyles = StyleSheet.create({
    ...typographyVariantSpecifications,
});

const spacing = (value: TypographyProps['m']): number | undefined =>
    value ? Number.parseInt(Theme.spacing[value], 10) : undefined;

export interface TextProps extends Omit<RNTextProps, 'disabled'>, TypographyProps {
    variant?: TextVariant;
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
    fontType = defaultTypographyProps.fontType ?? FontType.Default,
    numberOfLines,
    style,
    ...props
}) => {
    const theme = useTheme();
    const isBold = bold || variant === 'header';
    const spacingValues = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });

    return (
        <RNText
            numberOfLines={nowrap ? 1 : numberOfLines}
            style={[
                variantStyles[variant],
                {
                    fontFamily: getMobileFontFamily(fontType, isBold),
                    color: color
                        ? theme.color(color, shade ?? (theme.isDark ? 100 : 900))
                        : theme.componentColor('text'),
                    fontWeight: isBold ? '700' : undefined,
                    fontVariant: tabular ? ['tabular-nums'] : undefined,
                    textAlign: align,
                    textTransform: uppercase ? 'uppercase' : undefined,
                    flexShrink: nowrap ? 1 : undefined,
                    marginTop: spacing(spacingValues.marginTop),
                    marginRight: spacing(spacingValues.marginRight),
                    marginBottom: spacing(spacingValues.marginBottom),
                    marginLeft: spacing(spacingValues.marginLeft),
                    paddingTop: spacing(spacingValues.paddingTop),
                    paddingRight: spacing(spacingValues.paddingRight),
                    paddingBottom: spacing(spacingValues.paddingBottom),
                    paddingLeft: spacing(spacingValues.paddingLeft),
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
