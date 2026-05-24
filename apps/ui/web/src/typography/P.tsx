import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const P: FC<ComponentProps<'p'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    className,
    children,
    ...props
}) => {
    return (
        <p
            className={classNames(
                styles.p,
                styles[`font-${fontType}`],
                { [styles[`color-${color}`]]: !!color },
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
};
