import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyVariant } from "./model";
import styles from './typography.module.css';

export const H3: FC<ComponentProps<'h3'> & { variant?: TypographyVariant }> = ({
    className,
    children,
    variant,
    ...props
}) => {
    return (
        <h3 className={classNames(styles.h3, { 
            [styles[`variant-${variant}`]]: !!variant,
        }, className)} {...props}>
            {children}
        </h3>
    );
};
