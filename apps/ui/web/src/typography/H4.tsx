import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H4: FC<ComponentProps<'h4'> & TypographyProps> = ({
    variant = defaultTypographyProps.variant,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <h4
            className={classNames(
                styles.h4,
                styles[`font-${fontType}`],
                { [styles[`variant-${variant}`]]: !!variant },
                className
            )}
            {...props}
        >
            {children}
        </h4>
    );
};
