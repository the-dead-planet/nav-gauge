import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const H3: FC<ComponentProps<'h3'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    bold,
    shadow,
    className,
    children,
    ...props
}) => {
    return (
        <h3
            className={classNames(
                styles.h3,
                styles[`font-${fontType}`],
                {
                    [styles[`color-${color}`]]: !!color,
                    [styles['bold']]: !!bold,
                    [styles['shadow']]: !!shadow,
                },
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
};
