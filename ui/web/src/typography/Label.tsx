import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { useTextCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps> = ({
    color,
    fontType = defaultTypographyProps.fontType,
    align,
    nowrap,
    bold,
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
    disabled,
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
        <label className={classNames(styles.label, ...cssNames)} {...props}>
            {children}
        </label>
    );
};
