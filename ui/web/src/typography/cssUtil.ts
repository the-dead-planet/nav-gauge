import classNames from "classnames";
import { defaultTypographyProps, TypographyProps, useTheme } from "@ui";
import styles from './typography.module.css';

export const useTextCssNames = ({
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
}: TypographyProps & { className?: string; }): classNames.ArgumentArray => {
    const theme = useTheme();
    const spacing = {
        marginLeft: ml ?? mh ?? m,
        marginRight: mr ?? mh ?? m,
        marginTop: mt ?? mv ?? m,
        marginBottom: mb ?? mv ?? m,
        paddingLeft: pl ?? ph ?? p,
        paddingRight: pr ?? ph ?? p,
        paddingTop: pt ?? pv ?? p,
        paddingBottom: pb ?? pv ?? p,
    };

    return [
        styles[`font-${fontType}`],
        styles[`mode-${theme.mode}`],
        {
            [styles[`color-${color}`]]: !!color,
            [styles[`align-${align}`]]: !!align,
            [styles['nowrap']]: !!nowrap,
            [styles['bold']]: !!bold,
            [styles['disabled']]: !!disabled,
            [styles['uppercase']]: !!uppercase,
            [styles['shadow']]: !!shadow,
            [styles['tabular']]: !!tabular,
            ...(
                Object.fromEntries(['xs', 'sm', 'md', 'lg', 'xl']
                    .flatMap((size): [string, boolean][] => [
                        [styles[`margin-left-${size}`], spacing.marginLeft === size],
                        [styles[`margin-right-${size}`], spacing.marginRight === size],
                        [styles[`margin-top-${size}`], spacing.marginTop === size],
                        [styles[`margin-bottom-${size}`], spacing.marginBottom === size],
                        [styles[`padding-left-${size}`], spacing.paddingLeft === size],
                        [styles[`padding-right-${size}`], spacing.paddingRight === size],
                        [styles[`padding-top-${size}`], spacing.paddingTop === size],
                        [styles[`padding-bottom-${size}`], spacing.paddingBottom === size],
                    ]))
            ),
        },
        className,
    ];
};
