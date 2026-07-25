import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H5: FC<ComponentProps<'h5'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
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
        <h5 className={classNames(styles.h5, ...cssNames)} {...props}>
            {children}
        </h5>
    );
};
