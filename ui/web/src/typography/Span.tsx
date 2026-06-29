import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Span: FC<ComponentProps<'span'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <span className={classNames(styles.span, ...textCssNames(props))} {...props} >
            {children}
        </span>
    );
};
