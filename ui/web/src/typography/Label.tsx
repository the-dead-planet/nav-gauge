import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps> = ({
    children,
    ...props
}) => {
    return (
        <label className={classNames(styles.label, ...textCssNames(props))} {...props}>
            {children}
        </label>
    );
};
