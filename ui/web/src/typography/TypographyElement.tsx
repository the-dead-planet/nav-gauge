import { ComponentPropsWithoutRef, createElement, CSSProperties, ElementType, ReactElement } from "react";
import classNames from "classnames";
import { TypographyProps, useTheme } from "@ui";
import { useTextCssNames } from "./cssUtil";

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
    const cssNames = useTextCssNames({
        color,
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
    });

    return createElement(Component, {
        ...props,
        className: classNames(baseClassName, ...cssNames),
        style: color && shade !== undefined
            ? {
                ...style,
                color: theme.color(color, disabled ? (theme.isDark ? 700 : 300) : shade),
            } as CSSProperties
            : style,
    });
};
