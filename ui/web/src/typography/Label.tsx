import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    bold,
    shadow,
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
        bold,
        shadow,
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
