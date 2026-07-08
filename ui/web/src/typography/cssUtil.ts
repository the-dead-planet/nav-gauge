import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const textCssNames = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
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
}: TypographyProps & { className?: string; }): classNames.ArgumentArray => {
    return [
        styles[`font-${fontType}`],
        {
            [styles[`color-${color}`]]: !!color,
            [styles['bold']]: !!bold,
            [styles['shadow']]: !!shadow,
            [styles['tabular']]: !!tabular,
            ...(
                Object.fromEntries(['xs', 'sm', 'md', 'lg', 'xl']
                    .flatMap((size): [string, boolean][] => [
                        [styles[`margin-left-${size}`], m === size || mh === size || ml === size],
                        [styles[`margin-right-${size}`], m === size || mh === size || mr === size],
                        [styles[`margin-top-${size}`], m === size || mv === size || mt === size],
                        [styles[`margin-bottom-${size}`], m === size || mv === size || mb === size],
                        [styles[`padding-left-${size}`], p === size || ph === size || pl === size],
                        [styles[`padding-right-${size}`], p === size || ph === size || pr === size],
                        [styles[`padding-top-${size}`], p === size || pv === size || pt === size],
                        [styles[`padding-bottom-${size}`], p === size || pv === size || pb === size],
                    ]))
            ),
        },
        className,
    ];
};
