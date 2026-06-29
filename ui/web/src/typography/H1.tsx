import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H1: FC<ComponentProps<'h1'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h1 className={classNames(styles.h1, ...textCssNames(props))} {...props}>
            {children}
        </h1>
    );
};
