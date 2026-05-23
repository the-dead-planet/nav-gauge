import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyVariant } from "./model";
import styles from './typography.module.css';

export const H6: FC<ComponentProps<'h6'> & { variant?: TypographyVariant }> = ({
    className,
    children,
    variant,
    ...props
}) => {
    return (
        <h6 className={classNames(styles.h6, { 
            [styles[`variant-${variant}`]]: !!variant,
        }, className)} {...props}>
            {children}
        </h6>
    );
};
