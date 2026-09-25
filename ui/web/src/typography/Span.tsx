import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const Span: FC<ComponentProps<'span'> & TypographyProps> = (props) => (
    <TypographyElement as="span" baseClassName={styles.span} {...props} />
);
