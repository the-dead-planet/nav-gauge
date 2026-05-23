import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H2: FC<ComponentProps<'h2'> & TypographyProps> = ({
    variant = defaultTypographyProps.variant,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <h2
            className={classNames(
                styles.h2,
                styles[`font-${fontType}`],
                { [styles[`variant-${variant}`]]: !!variant },
                className
            )}
            {...props}
        >
            {children}
        </h2>
    );
};
