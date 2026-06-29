import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const P: FC<ComponentProps<'p'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <p className={classNames(styles.p, ...textCssNames(props))} {...props}>
            {children}
        </p>
    );
};
