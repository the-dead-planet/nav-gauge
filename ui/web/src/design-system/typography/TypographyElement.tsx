import { ComponentPropsWithoutRef, createElement, CSSProperties, ElementType, ReactElement } from "react";
import classNames from "classnames";
import { FontType, resolveTypographySpacing, TypographyProps } from "@ui";
import styles from './typography.module.css';

type TypographyElementProps<Element extends ElementType> = TypographyProps & {
    as: Element;
    baseClassName: string;
} & Omit<ComponentPropsWithoutRef<Element>, keyof TypographyProps | 'as'>;

export const TypographyElement = <Element extends ElementType>({
    as: Component,
    baseClassName,
    color = 'neutral',
    highlightColor = color,
    active,
    shade,
    highlightShade,
    fontType,
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
    const spacing = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });

    return createElement(Component, {
        ...props,
        'data-appearance-variant': 'default',
        'data-appearance-color': color,
        'data-appearance-highlight': highlightColor,
        'data-active': active || undefined,
        'aria-disabled': disabled || undefined,
        className: classNames(
            baseClassName,
            styles[`font-${fontType ?? FontType.Default}`],
            align && styles[`align-${align}`],
            nowrap && styles.nowrap,
            bold && styles.bold,
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
            '--appearance-default-glyphs-override': shade === undefined ? undefined : `var(--color-${color}-${shade})`,
            '--appearance-interaction-glyphs-override': highlightShade === undefined ? undefined : `var(--color-${highlightColor}-${highlightShade})`,
        } as CSSProperties,
    });
};
