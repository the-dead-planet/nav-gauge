import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H6: FC<ComponentProps<'h6'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h6 className={classNames(styles.h6, ...textCssNames(props))} {...props}>
            {children}
        </h6>
    );
};
