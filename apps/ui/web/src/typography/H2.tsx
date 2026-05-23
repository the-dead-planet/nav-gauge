import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyVariant } from "./model";
import styles from './typography.module.css';

export const H2: FC<ComponentProps<'h2'> & { variant?: TypographyVariant }> = ({
    className,
    children,
    variant,
    ...props
}) => {
    return (
        <h2 className={classNames(styles.h2, { 
            [styles[`variant-${variant}`]]: !!variant,
        }, className)} {...props}>
            {children}
        </h2>
    );
};
