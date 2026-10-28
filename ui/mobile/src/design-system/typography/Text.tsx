import { FC } from "react";
import { Platform, Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { DEFAULT_COLOR, FontType, resolveTypographyFontWeight, resolveTypographySpacing, TextUsage, typographyUsageSpecifications, TypographyProps, Theme, ThemeAppearanceState, useTheme } from "@ui";
import { resolveMobileFont } from "./fontFamily";

export type { TextUsage } from '@ui';

const usageStyles = StyleSheet.create({
    ...typographyUsageSpecifications,
});

const spacing = (value: TypographyProps['m']): number | undefined =>
    value ? Number.parseInt(Theme.spacing[value], 10) : undefined;

export interface TextProps extends Omit<RNTextProps, 'disabled'>, TypographyProps {
    usage?: TextUsage;
    /** Visual state supplied by the owning interactive renderer. */
    appearanceState?: ThemeAppearanceState;
}

export const Text: FC<TextProps> = ({
    themeMode,
    usage = 'body',
    color = DEFAULT_COLOR,
    highlightColor = color,
    highlighted,
    appearanceState = highlighted ? 'active-pressed' : 'default',
    shade,
    highlightShade,
    align,
    nowrap,
    bold,
    fontWeight,
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
    const theme = useTheme().forMode(themeMode);
    const spacingValues = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });
    const state = disabled ? 'disabled' : appearanceState;
    const appearance = theme.resolveAppearance(undefined, color, highlightColor, state);
    const resolvedFontWeight = resolveTypographyFontWeight(
        fontWeight,
        bold,
        appearance.fontWeight ?? typographyUsageSpecifications[usage].fontWeight,
    );
    const font = resolveMobileFont(fontType, resolvedFontWeight, Platform.OS);
    const interactive = state === 'hover-focus' || state === 'active-pressed';
    const overrideShade = interactive ? highlightShade : shade;
    const glyphs = state === 'disabled' || overrideShade === undefined
        ? appearance.glyphs
        : theme.color(interactive ? highlightColor : color, overrideShade);

    return (
        <RNText
            accessibilityRole={usage === 'header' ? 'header' : undefined}
            numberOfLines={nowrap ? 1 : numberOfLines}
            style={[
                usageStyles[usage],
                {
                    fontFamily: font.fontFamily,
                    color: glyphs,
                    fontWeight: font.fontWeight,
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
                        ? theme.color(color, 800)
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
