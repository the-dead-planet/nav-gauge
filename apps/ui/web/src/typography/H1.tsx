import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H1: FC<ComponentProps<'h1'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <h1
            className={classNames(
                styles.h1,
                styles[`font-${fontType}`],
                { [styles[`color-${color}`]]: !!color },
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
};
