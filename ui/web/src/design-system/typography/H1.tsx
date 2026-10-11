import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H1: FC<ComponentProps<'h1'> & TypographyProps> = (props) => (
    <TypographyElement as="h1" baseClassName={styles.h1} {...props} />
);
