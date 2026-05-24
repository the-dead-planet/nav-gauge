import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H5: FC<ComponentProps<'h5'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <h5
            className={classNames(
                styles.h5,
                styles[`font-${fontType}`],
                { [styles[`color-${color}`]]: !!color },
                className
            )}
            {...props}
        >
            {children}
        </h5>
    );
};
