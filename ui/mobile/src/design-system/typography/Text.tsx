import { FC } from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { FontType, resolveTypographySpacing, TextVariant, typographyVariantSpecifications, TypographyProps, Theme, ThemeAppearanceState, useTheme } from "@ui";
import { getMobileFontFamily } from "./fontFamily";

export type { TextVariant } from '@ui';

const variantStyles = StyleSheet.create({
    ...typographyVariantSpecifications,
});

const spacing = (value: TypographyProps['m']): number | undefined =>
    value ? Number.parseInt(Theme.spacing[value], 10) : undefined;

export interface TextProps extends Omit<RNTextProps, 'disabled'>, TypographyProps {
    variant?: TextVariant;
    /** Visual state supplied by the owning interactive renderer. */
    appearanceState?: ThemeAppearanceState;
}

export const Text: FC<TextProps> = ({
    variant = 'body',
    color = 'neutral',
    highlightColor = color,
    active,
    appearanceState = active ? 'active' : 'default',
    shade,
    highlightShade,
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
    fontType = FontType.Default,
    numberOfLines,
    style,
    ...props
}) => {
    const theme = useTheme();
    const isBold = bold || variant === 'header';
    const spacingValues = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });
    const state = disabled ? 'disabled' : appearanceState;
    const appearance = theme.resolveAppearance(undefined, color, highlightColor, state);
    const interactive = state === 'interaction' || state === 'active';
    const overrideShade = interactive ? highlightShade : shade;
    const glyphs = state === 'disabled' || overrideShade === undefined
        ? appearance.glyphs
        : theme.color(interactive ? highlightColor : color, overrideShade);

    return (
        <RNText
            accessibilityRole={variant === 'header' ? 'header' : undefined}
            numberOfLines={nowrap ? 1 : numberOfLines}
            style={[
                variantStyles[variant],
                {
                    fontFamily: getMobileFontFamily(fontType, isBold),
                    color: glyphs,
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
                    textShadowColor: shadow && !disabled
                        ? theme.color(color, 900)
                        : undefined,
                    textShadowOffset: shadow && !disabled ? {
                        width: -1,
                        height: 0,
                    } : undefined,
                    textShadowRadius: shadow && !disabled ? 1 : undefined,
                } satisfies TextStyle,
                style,
                disabled && {
                    color: glyphs,
                    textShadowRadius: 0,
                },
            ]}
            {...props}
        />
    );
};
