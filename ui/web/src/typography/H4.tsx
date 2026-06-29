import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const H4: FC<ComponentProps<'h4'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <h4 className={classNames(styles.h4, ...textCssNames(props))} {...props}>
            {children}
        </h4>
    );
};
