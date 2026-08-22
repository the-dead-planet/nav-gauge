import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H2: FC<ComponentProps<'h2'> & TypographyProps> = ({
    color,
    fontType = defaultTypographyProps.fontType,
    align,
    nowrap,
    bold,
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
    children,
    ...props
}) => {
    const cssNames = textCssNames({
        color,
        fontType,
        align,
        nowrap,
        bold,
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
    return (
        <h2 className={classNames(styles.h2, ...cssNames)} {...props}>
            {children}
        </h2>
    );
};
