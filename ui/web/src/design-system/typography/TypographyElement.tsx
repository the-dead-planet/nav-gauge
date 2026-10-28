import { ComponentPropsWithoutRef, createElement, CSSProperties, ElementType, ReactElement } from "react";
import classNames from "classnames";
import { FontType, resolveTypographyFontWeight, resolveTypographySpacing, useTheme, TypographyProps } from "@ui";
import styles from './typography.module.css';

type TypographyElementProps<Element extends ElementType> = TypographyProps & {
    as: Element;
    baseClassName: string;
} & Omit<ComponentPropsWithoutRef<Element>, keyof TypographyProps | 'as'>;

export const TypographyElement = <Element extends ElementType>({
    as: Component,
    baseClassName,
    themeMode,
    color,
    highlightColor = color,
    highlighted,
    shade,
    highlightShade,
    fontType,
    fontWeight,
    align,
    nowrap,
    bold,
    disabled,
    uppercase,
    shadow,
    tabular,
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
    className,
    style,
    ...props
}: TypographyElementProps<Element>): ReactElement => {
    const theme = useTheme();
    const spacing = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });
    const colorVariable = color === undefined ? '--appearance-color' : `--color-${color}`;
    const highlightVariable = highlightColor === undefined ? '--appearance-highlight' : `--color-${highlightColor}`;

    return createElement(Component, {
        ...props,
        'data-appearance-variant': color === undefined ? undefined : 'default',
        'data-appearance-mode': themeMode ?? theme.mode,
        'data-appearance-color': color,
        'data-appearance-highlight': highlightColor,
        'data-highlighted': highlighted || undefined,
        'aria-disabled': disabled || undefined,
        className: classNames(
            baseClassName,
            styles[`font-${fontType ?? FontType.Default}`],
            align && styles[`align-${align}`],
            nowrap && styles.nowrap,
            (fontWeight !== undefined || bold) && styles[`weight-${resolveTypographyFontWeight(fontWeight, bold)}`],
            disabled && styles.disabled,
            uppercase && styles.uppercase,
            shadow && styles.shadow,
            tabular && styles.tabular,
            styles[`margin-left-${spacing.marginLeft}`],
            styles[`margin-right-${spacing.marginRight}`],
            styles[`margin-top-${spacing.marginTop}`],
            styles[`margin-bottom-${spacing.marginBottom}`],
            styles[`padding-left-${spacing.paddingLeft}`],
            styles[`padding-right-${spacing.paddingRight}`],
            styles[`padding-top-${spacing.paddingTop}`],
            styles[`padding-bottom-${spacing.paddingBottom}`],
            className,
        ),
        style: {
            ...style,
            '--appearance-default-glyphs-override': shade === undefined ? undefined : `var(${colorVariable}-${shade})`,
            '--appearance-hover-focus-glyphs-override': highlightShade === undefined ? undefined : `var(${highlightVariable}-${highlightShade})`,
            '--appearance-active-pressed-glyphs-override': highlightShade === undefined ? undefined : `var(${highlightVariable}-${highlightShade})`,
        } as CSSProperties,
    });
};
