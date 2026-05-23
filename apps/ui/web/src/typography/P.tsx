import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const P: FC<ComponentProps<'p'> & TypographyProps> = ({
    variant = defaultTypographyProps.variant,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <p
            className={classNames(
                styles.p,
                styles[`font-${fontType}`],
                { [styles[`variant-${variant}`]]: !!variant },
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
};
