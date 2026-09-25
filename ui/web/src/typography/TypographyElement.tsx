import { ComponentPropsWithoutRef, createElement, CSSProperties, ElementType, ReactElement } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { useTextCssNames } from "./cssUtil";

type TypographyElementProps<Element extends ElementType> = TypographyProps & {
    as: Element;
    baseClassName: string;
} & Omit<ComponentPropsWithoutRef<Element>, keyof TypographyProps | 'as'>;

type TypographyStyle = CSSProperties & { '--typography-color'?: string };

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
        style: color && shade
            ? { ...style, '--typography-color': `var(--color-${color}-${shade})` } as TypographyStyle
            : style,
    });
};
