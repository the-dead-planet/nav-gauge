import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { useTextCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Span: FC<ComponentProps<'span'> & TypographyProps> = ({
    color,
    fontType = defaultTypographyProps.fontType,
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
    children,
    ...props
}) => {
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
    return (
        <span className={classNames(styles.span, ...cssNames)} {...props}>
            {children}
        </span>
    );
};
