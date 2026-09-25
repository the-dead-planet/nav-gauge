import { ComponentPropsWithoutRef, createElement, CSSProperties, ElementType, ReactElement } from "react";
import classNames from "classnames";
import { defaultTypographyProps, resolveTypographySpacing, TypographyProps, useTheme } from "@ui";
import styles from './typography.module.css';

type TypographyElementProps<Element extends ElementType> = TypographyProps & {
    as: Element;
    baseClassName: string;
} & Omit<ComponentPropsWithoutRef<Element>, keyof TypographyProps | 'as'>;

export const TypographyElement = <Element extends ElementType>({
    as: Component,
    baseClassName,
    color,
    shade,
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
    const theme = useTheme();
    const spacing = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml, p, pv, ph, pt, pr, pb, pl });

    return createElement(Component, {
        ...props,
        className: classNames(
            baseClassName,
            styles[`font-${fontType ?? defaultTypographyProps.fontType}`],
            styles[`mode-${theme.mode}`],
            color && styles[`color-${color}`],
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
        style: color && shade !== undefined
            ? {
                ...style,
                color: theme.color(color, disabled ? (theme.isDark ? 700 : 300) : shade),
            } as CSSProperties
            : style,
    });
};
