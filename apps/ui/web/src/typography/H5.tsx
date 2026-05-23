import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyVariant } from "./model";
import styles from './typography.module.css';

export const H5: FC<ComponentProps<'h5'> & { variant?: TypographyVariant }> = ({
    className,
    children,
    variant,
    ...props
}) => {
    return (
        <h5 className={classNames(styles.h5, { 
            [styles[`variant-${variant}`]]: !!variant,
        }, className)} {...props}>
            {children}
        </h5>
    );
};
