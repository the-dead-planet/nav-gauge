import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyVariant } from "./model";
import styles from './typography.module.css';

export const P: FC<ComponentProps<'p'> & { variant?: TypographyVariant }> = ({
    className,
    children,
    variant,
    ...props
}) => {
    return (
        <p className={classNames(styles.p, { 
            [styles[`variant-${variant}`]]: !!variant,
        }, className)} {...props}>
            {children}
        </p>
    );
};
