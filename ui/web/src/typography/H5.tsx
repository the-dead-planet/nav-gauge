import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H5: FC<ComponentProps<'h5'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h5 className={classNames(styles.h5, ...textCssNames(props))} {...props}>
            {children}
        </h5 >
    );
};
