import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const Span: FC<ComponentProps<'span'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    bold,
    shadow,
    className,
    children,
    ...props
}) => {
    return (
        <span
            className={classNames(
                styles.span,
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
        </span>
    );
};
