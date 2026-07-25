import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H6: FC<ComponentProps<'h6'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    align,
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
        <h6 className={classNames(styles.h6, ...cssNames)} {...props}>
            {children}
        </h6>
    );
};
