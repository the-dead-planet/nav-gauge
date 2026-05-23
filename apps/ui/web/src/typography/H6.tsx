import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H6: FC<ComponentProps<'h6'> & TypographyProps> = ({
    variant = defaultTypographyProps.variant,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <h6
            className={classNames(
                styles.h6,
                styles[`font-${fontType}`],
                { [styles[`variant-${variant}`]]: !!variant },
                className
            )}
            {...props}
        >
            {children}
        </h6>
    );
};
