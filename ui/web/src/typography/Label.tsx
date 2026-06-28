import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, TypographyProps } from "@ui";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps> = ({
    color = defaultTypographyProps.color,
    fontType = defaultTypographyProps.fontType,
    bold,
    shadow,
    className,
    children,
    ...props
}) => {
    return (
        <label
            className={classNames(
                styles.label,
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
        </label>
    );
};
