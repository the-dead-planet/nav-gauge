import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H3: FC<ComponentProps<'h3'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h3 className={classNames(styles.h3, ...textCssNames(props))} {...props}>
            {children}
        </h3 >
    );
};
