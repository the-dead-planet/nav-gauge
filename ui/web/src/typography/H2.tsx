import { ComponentProps, FC } from "react";
import classNames from "classnames";
import {  TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H2: FC<ComponentProps<'h2'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h2 className={classNames(styles.h2, ...textCssNames(props))}   {...props}>
            {children}
        </h2>
    );
};
